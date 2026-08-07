import express from 'express'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

const PORT = Number(process.env.PORT || 8787)
const ADMIN_KEY = process.env.ADMIN_KEY || ''
const NODE_ENV = process.env.NODE_ENV || 'development'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env')
  process.exit(1)
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)

const buckets = new Map()

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(express.json({ limit: '150kb' }))

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')

  if (NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  next()
})

function rateLimit(windowMs = 60_000, max = 20) {
  return (req, res, next) => {
    const now = Date.now()
    const key = `${req.ip}:${req.path}`

    const row = buckets.get(key) || {
      start: now,
      count: 0
    }

    if (now - row.start > windowMs) {
      row.start = now
      row.count = 0
    }

    row.count++
    buckets.set(key, row)

    if (row.count > max) {
      return res.status(429).json({
        error: 'Too many requests. Please try again shortly.'
      })
    }

    next()
  }
}

setInterval(() => {
  const cutoff = Date.now() - 10 * 60_000

  for (const [key, value] of buckets) {
    if (value.start < cutoff) {
      buckets.delete(key)
    }
  }
}, 5 * 60_000).unref()

function adminOnly(req, res, next) {
  if (!ADMIN_KEY) {
    return res.status(503).json({
      error: 'Admin access is not configured.'
    })
  }

  const supplied = String(req.get('x-admin-key') || '')

  const suppliedBuffer = Buffer.from(supplied)
  const expectedBuffer = Buffer.from(ADMIN_KEY)

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return res.status(401).json({
      error: 'Invalid admin key'
    })
  }

  next()
}

function cleanPayload(body = {}) {
  const output = {}

  for (const [key, value] of Object.entries(body)) {
    if (key === 'website') continue

    if (typeof value === 'string') {
      output[key] = value
        .trim()
        .replace(
          /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
          ''
        )
        .slice(0, 3000)
    }

    if (typeof value === 'boolean') {
      output[key] = value
    }
  }

  return output
}

function looksLikeBot(body = {}) {
  return (
    typeof body.website === 'string' &&
    body.website.trim().length > 0
  )
}

async function writeAudit(action, entityType, entityId, details = {}) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        action,
        entity_type: entityType,
        entity_id: entityId ? String(entityId) : null,
        details
      })
  } catch (error) {
    console.error('Audit log error:', error.message)
  }
}

function normalizeSubmission(type, row) {
  return {
    id: row.id,
    type,
    createdAt: row.created_at,
    status: row.status || 'new',

    name:
      row.full_name ||
      row.name ||
      '',

    fullName:
      row.full_name ||
      '',

    email:
      row.email ||
      '',

    phone:
      row.phone ||
      '',

    ward:
      row.ward ||
      '',

    subCounty:
      row.sub_county ||
      '',

    subject:
      row.subject ||
      '',

    message:
      row.message ||
      row.idea ||
      '',

    interest:
      row.interest ||
      '',

    category:
      row.category ||
      ''
  }
}

async function loadCampaignContent() {
  const { data, error } = await supabase
    .from('campaign_content')
    .select('content_key, content_value')

  if (error) {
    throw error
  }

  const result = {}

  for (const row of data || []) {
    result[row.content_key] = row.content_value ?? ''
  }

  return result
}

app.get('/api/health', async (_req, res) => {
  try {
    const { error } = await supabase
      .from('campaign_content')
      .select('id')
      .limit(1)

    if (error) throw error

    res.json({
      status: 'ok',
      service: 'philip-kaloki-website-api',
      storage: 'supabase-postgresql',
      phase: 'supabase'
    })
  } catch (error) {
    console.error(error)

    res.status(503).json({
      status: 'error',
      service: 'philip-kaloki-website-api',
      storage: 'supabase-postgresql',
      error: 'Database connection failed'
    })
  }
})

app.get('/api/content', async (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=60')

    const content = await loadCampaignContent()

    res.json(content)
  } catch (error) {
    console.error('Content load error:', error)

    res.status(500).json({
      error: 'Unable to load website content'
    })
  }
})

app.post(
  '/api/submissions/:type',
  rateLimit(60_000, 8),
  async (req, res) => {
    try {
      const type = req.params.type

      const allowed = new Set([
        'contact',
        'volunteer',
        'idea',
        'newsletter'
      ])

      if (!allowed.has(type)) {
        return res.status(400).json({
          error: 'Unsupported submission type'
        })
      }

      if (looksLikeBot(req.body)) {
        return res.status(201).json({
          ok: true
        })
      }

      const payload = cleanPayload(req.body)

      if (!Object.keys(payload).length) {
        return res.status(400).json({
          error: 'Submission is empty'
        })
      }

      if (
        type === 'newsletter' &&
        !String(payload.email || '').includes('@')
      ) {
        return res.status(400).json({
          error: 'A valid email is required.'
        })
      }

      let table
      let record

      if (type === 'contact') {
        table = 'contact_submissions'

        record = {
          full_name:
            payload.fullName ||
            payload.name ||
            '',

          email:
            payload.email ||
            '',

          phone:
            payload.phone ||
            '',

          subject:
            payload.subject ||
            '',

          message:
            payload.message ||
            '',

          ward:
            payload.ward ||
            ''
        }
      }

      if (type === 'volunteer') {
        table = 'volunteer_submissions'

        record = {
          full_name:
            payload.fullName ||
            payload.name ||
            '',

          email:
            payload.email ||
            '',

          phone:
            payload.phone ||
            '',

          ward:
            payload.ward ||
            '',

          sub_county:
            payload.subCounty ||
            payload.sub_county ||
            '',

          interest:
            payload.interest ||
            '',

          message:
            payload.message ||
            ''
        }
      }

      if (type === 'idea') {
        table = 'citizen_ideas'

        record = {
          full_name:
            payload.fullName ||
            payload.name ||
            '',

          email:
            payload.email ||
            '',

          phone:
            payload.phone ||
            '',

          ward:
            payload.ward ||
            '',

          category:
            payload.category ||
            '',

          idea:
            payload.idea ||
            payload.message ||
            ''
        }
      }

      if (type === 'newsletter') {
        table = 'newsletter_subscribers'

        record = {
          email: payload.email,
          full_name:
            payload.fullName ||
            payload.name ||
            ''
        }
      }

      let query = supabase
        .from(table)
        .insert(record)
        .select()
        .single()

      const { data, error } = await query

      if (error) {
        if (
          type === 'newsletter' &&
          error.code === '23505'
        ) {
          return res.status(200).json({
            ok: true,
            alreadySubscribed: true
          })
        }

        throw error
      }

      await writeAudit(
        'submission_created',
        table,
        data.id,
        {
          type
        }
      )

      res.status(201).json({
        ok: true,
        id: data.id
      })
    } catch (error) {
      console.error('Submission error:', error)

      res.status(500).json({
        error: 'Unable to save submission'
      })
    }
  }
)

app.get(
  '/api/admin/submissions',
  rateLimit(60_000, 30),
  adminOnly,
  async (_req, res) => {
    try {
      const [
        contacts,
        volunteers,
        ideas,
        newsletters
      ] = await Promise.all([
        supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', {
            ascending: false
          }),

        supabase
          .from('volunteer_submissions')
          .select('*')
          .order('created_at', {
            ascending: false
          }),

        supabase
          .from('citizen_ideas')
          .select('*')
          .order('created_at', {
            ascending: false
          }),

        supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', {
            ascending: false
          })
      ])

      const errors = [
        contacts.error,
        volunteers.error,
        ideas.error,
        newsletters.error
      ].filter(Boolean)

      if (errors.length) {
        throw errors[0]
      }

      const rows = [
        ...(contacts.data || []).map(row =>
          normalizeSubmission('contact', row)
        ),

        ...(volunteers.data || []).map(row =>
          normalizeSubmission('volunteer', row)
        ),

        ...(ideas.data || []).map(row =>
          normalizeSubmission('idea', row)
        ),

        ...(newsletters.data || []).map(row =>
          normalizeSubmission('newsletter', row)
        )
      ]

      rows.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )

      res.json(rows)
    } catch (error) {
      console.error('Admin submission error:', error)

      res.status(500).json({
        error: 'Unable to load submissions'
      })
    }
  }
)

app.patch(
  '/api/admin/submissions/:id',
  adminOnly,
  async (req, res) => {
    try {
      const id = req.params.id

      const status =
        ['new', 'reviewed', 'closed'].includes(
          String(req.body.status)
        )
          ? String(req.body.status)
          : null

      if (!status) {
        return res.status(400).json({
          error: 'Invalid status'
        })
      }

      const tables = [
        ['contact', 'contact_submissions'],
        ['volunteer', 'volunteer_submissions'],
        ['idea', 'citizen_ideas'],
        ['newsletter', 'newsletter_subscribers']
      ]

      for (const [type, table] of tables) {
        const { data, error } = await supabase
          .from(table)
          .update({ status })
          .eq('id', id)
          .select()

        if (error) {
          if (
            table === 'newsletter_subscribers' &&
            error.message.includes('status')
          ) {
            continue
          }

          throw error
        }

        if (data && data.length) {
          await writeAudit(
            'submission_status_changed',
            table,
            id,
            { status }
          )

          return res.json(
            normalizeSubmission(type, data[0])
          )
        }
      }

      res.status(404).json({
        error: 'Submission not found'
      })
    } catch (error) {
      console.error('Update submission error:', error)

      res.status(500).json({
        error: 'Unable to update submission'
      })
    }
  }
)

app.put(
  '/api/admin/content',
  adminOnly,
  async (req, res) => {
    try {
      const payload = cleanPayload(req.body)

      if (!Object.keys(payload).length) {
        return res.status(400).json({
          error: 'No content supplied'
        })
      }

      const rows = Object.entries(payload).map(
        ([content_key, content_value]) => ({
          content_key,
          content_value: String(content_value),
          updated_at: new Date().toISOString()
        })
      )

      const { error } = await supabase
        .from('campaign_content')
        .upsert(
          rows,
          {
            onConflict: 'content_key'
          }
        )

      if (error) throw error

      await writeAudit(
        'campaign_content_updated',
        'campaign_content',
        null,
        {
          fields: Object.keys(payload)
        }
      )

      const content = await loadCampaignContent()

      res.json(content)
    } catch (error) {
      console.error('Save content error:', error)

      res.status(500).json({
        error: 'Unable to save website content'
      })
    }
  }
)

app.get(
  '/api/news',
  async (_req, res) => {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', {
          ascending: false
        })

      if (error) throw error

      res.json(data || [])
    } catch (error) {
      console.error('News error:', error)

      res.status(500).json({
        error: 'Unable to load news'
      })
    }
  }
)

app.get(
  '/api/events',
  async (_req, res) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('event_date', {
          ascending: true
        })

      if (error) throw error

      res.json(data || [])
    } catch (error) {
      console.error('Events error:', error)

      res.status(500).json({
        error: 'Unable to load events'
      })
    }
  }
)

app.get(
  '/api/media',
  async (_req, res) => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('published', true)
        .order('created_at', {
          ascending: false
        })

      if (error) throw error

      res.json(data || [])
    } catch (error) {
      console.error('Media error:', error)

      res.status(500).json({
        error: 'Unable to load media'
      })
    }
  }
)

const distDir = path.join(__dirname, 'dist')

app.use(
  express.static(
    distDir,
    {
      maxAge:
        NODE_ENV === 'production'
          ? '1h'
          : 0,

      etag: true
    }
  )
)

app.get('*', async (_req, res) => {
  res.sendFile(
    path.join(distDir, 'index.html'),
    error => {
      if (error) {
        res
          .status(503)
          .send(
            'Frontend build not found. Run npm run build first.'
          )
      }
    }
  )
})

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `Philip Kaloki Supabase API running on port ${PORT}`
    )

    console.log(
      `Database: ${SUPABASE_URL}`
    )

    if (!ADMIN_KEY) {
      console.warn(
        'ADMIN_KEY is not set. Admin routes are disabled.'
      )
    }
  }
)
