import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT || 8787)
const ADMIN_KEY = process.env.ADMIN_KEY || ''
const NODE_ENV = process.env.NODE_ENV || 'development'
const dataDir = path.join(__dirname, 'data')
const submissionsFile = path.join(dataDir, 'submissions.json')
const contentFile = path.join(dataDir, 'content.json')
const buckets = new Map()

app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(express.json({ limit: '150kb' }))
app.use((_req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff')
  res.setHeader('X-Frame-Options','DENY')
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()')
  res.setHeader('Cross-Origin-Opener-Policy','same-origin')
  if (NODE_ENV === 'production') res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains')
  next()
})

function rateLimit(windowMs=60_000,max=20){return (req,res,next)=>{const now=Date.now();const key=`${req.ip}:${req.path}`;const row=buckets.get(key)||{start:now,count:0};if(now-row.start>windowMs){row.start=now;row.count=0}row.count++;buckets.set(key,row);if(row.count>max)return res.status(429).json({error:'Too many requests. Please try again shortly.'});next()}}
setInterval(()=>{const cutoff=Date.now()-10*60_000;for(const [k,v] of buckets)if(v.start<cutoff)buckets.delete(k)},5*60_000).unref()

async function readJson(file, fallback) { try { return JSON.parse(await fs.readFile(file, 'utf8')) } catch { return fallback } }
async function writeJson(file, data) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(data, null, 2)) }
function adminOnly(req, res, next) {
  if (!ADMIN_KEY) return res.status(503).json({ error: 'Admin access is not configured.' })
  const supplied = String(req.get('x-admin-key') || '')
  const a=Buffer.from(supplied), b=Buffer.from(ADMIN_KEY)
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return res.status(401).json({ error: 'Invalid admin key' })
  next()
}
function cleanPayload(body = {}) {
  const out = {}
  for (const [k, v] of Object.entries(body)) {
    if (k === 'website') continue
    if (typeof v === 'string') out[k] = v.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').slice(0, 3000)
    else if (typeof v === 'boolean') out[k] = v
  }
  return out
}
function looksLikeBot(body={}) { return typeof body.website === 'string' && body.website.trim().length > 0 }

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'philip-kaloki-website-api', storage: 'json-development', phase: '13-16' }))
app.get('/api/content', async (_req, res) => { res.setHeader('Cache-Control','public, max-age=60'); res.json(await readJson(contentFile, {})) })

app.post('/api/submissions/:type', rateLimit(60_000,8), async (req, res) => {
  const allowed = new Set(['contact', 'volunteer', 'idea', 'newsletter'])
  if (!allowed.has(req.params.type)) return res.status(400).json({ error: 'Unsupported submission type' })
  if (looksLikeBot(req.body)) return res.status(201).json({ ok: true })
  const payload = cleanPayload(req.body)
  if (!Object.keys(payload).length) return res.status(400).json({ error: 'Submission is empty' })
  if(req.params.type==='newsletter' && !String(payload.email||'').includes('@')) return res.status(400).json({error:'A valid email is required.'})
  const rows = await readJson(submissionsFile, [])
  const record = { id: crypto.randomUUID(), type: req.params.type, createdAt: new Date().toISOString(), status: 'new', ...payload }
  rows.unshift(record)
  await writeJson(submissionsFile, rows.slice(0,5000))
  res.status(201).json({ ok: true, id: record.id })
})

app.get('/api/admin/submissions', rateLimit(60_000,30), adminOnly, async (_req, res) => res.json(await readJson(submissionsFile, [])))
app.patch('/api/admin/submissions/:id', adminOnly, async (req, res) => {
  const rows = await readJson(submissionsFile, [])
  const index = rows.findIndex((r) => r.id === req.params.id)
  if (index < 0) return res.status(404).json({ error: 'Submission not found' })
  const status = ['new','reviewed','closed'].includes(String(req.body.status)) ? String(req.body.status) : rows[index].status
  rows[index] = { ...rows[index], status }
  await writeJson(submissionsFile, rows)
  res.json(rows[index])
})
app.put('/api/admin/content', adminOnly, async (req, res) => {
  const current = await readJson(contentFile, {})
  const updated = { ...current, ...cleanPayload(req.body) }
  await writeJson(contentFile, updated)
  res.json(updated)
})

const distDir = path.join(__dirname, 'dist')
app.use(express.static(distDir, { maxAge: NODE_ENV==='production' ? '1h' : 0, etag: true }))
app.get('*', async (_req, res) => {
  try { await fs.access(path.join(distDir, 'index.html')); res.sendFile(path.join(distDir, 'index.html')) }
  catch { res.status(503).send('Frontend build not found. Run npm run build first.') }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Philip Kaloki website server running on port ${PORT}`)
  if (!ADMIN_KEY) console.warn('ADMIN_KEY is not set. Admin routes are disabled until you configure it.')
  if (NODE_ENV === 'production') console.warn('JSON storage is temporary. Connect Supabase before relying on persistent production submissions.')
})
