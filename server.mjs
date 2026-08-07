import express from 'express'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'

dotenv.config()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT || 8787)
const ADMIN_KEY = process.env.ADMIN_KEY || ''
const NODE_ENV = process.env.NODE_ENV || 'development'
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || ''
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) { console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession:false, autoRefreshToken:false } })

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ])
    cb(null, allowed.has(file.mimetype))
  }
})

function safeFileName(name = 'upload') {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function uploadFileToCampaignMedia(file){
  const ext=path.extname(file.originalname||'')
  const base=safeFileName(path.basename(file.originalname||'upload',ext))||'upload'
  const objectPath=`${new Date().getUTCFullYear()}/${Date.now()}-${crypto.randomUUID()}-${base}${ext}`
  const{error}=await supabase.storage.from('campaign-media').upload(objectPath,file.buffer,{contentType:file.mimetype,upsert:false,cacheControl:'3600'})
  if(error)throw error
  const{data}=supabase.storage.from('campaign-media').getPublicUrl(objectPath)
  return{path:objectPath,url:data.publicUrl}
}

const buckets = new Map()

app.set('trust proxy',1); app.disable('x-powered-by'); app.use(express.json({limit:'250kb'}))
app.use((_req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');if(NODE_ENV==='production')res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');next()})
function rateLimit(windowMs=60_000,max=30){return(req,res,next)=>{const now=Date.now(),key=`${req.ip}:${req.path}`,row=buckets.get(key)||{start:now,count:0};if(now-row.start>windowMs){row.start=now;row.count=0}row.count++;buckets.set(key,row);if(row.count>max)return res.status(429).json({error:'Too many requests.'});next()}}
function adminOnly(req,res,next){if(!ADMIN_KEY)return res.status(503).json({error:'Admin access not configured'});const a=Buffer.from(String(req.get('x-admin-key')||'')),b=Buffer.from(ADMIN_KEY);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({error:'Invalid admin key'});next()}
function clean(body={}){const out={};for(const[k,v]of Object.entries(body)){if(k==='website')continue;if(typeof v==='string')out[k]=v.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').slice(0,10000);else if(typeof v==='boolean')out[k]=v}return out}
function bot(body={}){return typeof body.website==='string'&&body.website.trim().length>0}
async function audit(action,entity_type,entity_id=null,details={}){const{error}=await supabase.from('audit_logs').insert({action,entity_type,entity_id:entity_id?String(entity_id):null,details});if(error)console.error('audit:',error.message)}
async function contentObject(){const{data,error}=await supabase.from('campaign_content').select('content_key,content_value');if(error)throw error;return Object.fromEntries((data||[]).map(r=>[r.content_key,r.content_value??'']))}
function normalize(type,row){return{id:row.id,type,createdAt:row.created_at,status:row.status||'new',name:row.full_name||'',email:row.email||'',phone:row.phone||'',ward:row.ward||'',subCounty:row.sub_county||'',subject:row.subject||'',message:row.message||row.idea||'',interest:row.interest||'',category:row.category||''}}

app.get('/api/health',async(_req,res)=>{const{error}=await supabase.from('campaign_content').select('id').limit(1);res.status(error?503:200).json({status:error?'error':'ok',service:'philip-kaloki-website-api',storage:'supabase-postgresql',phase:'phase-29'})})
app.get('/api/content',async(_req,res)=>{try{res.setHeader('Cache-Control','public,max-age=60');res.json(await contentObject())}catch(e){console.error(e);res.status(500).json({error:'Unable to load content'})}})

app.post('/api/submissions/:type',rateLimit(60_000,20),async(req,res)=>{
  try{
    const type=String(req.params.type||'')
    if(!['contact','volunteer','idea','newsletter'].includes(type)){
      return res.status(400).json({error:'Unsupported submission type.'})
    }

    if(bot(req.body))return res.status(201).json({ok:true})

    const p=clean(req.body)
    let table=''
    let record={}

    if(type==='volunteer'){
      const name=p.fullName||p.name||''
      if(!name||!p.phone||!p.ward||!p.interest){
        return res.status(400).json({error:'Please complete your name, phone, ward and area of interest.'})
      }
      if(String(p.consent||'').toLowerCase()!=='yes'){
        return res.status(400).json({error:'Please confirm consent before submitting.'})
      }

      table='volunteer_submissions'
      record={
        full_name:name,
        email:p.email||'',
        phone:p.phone||'',
        ward:p.ward||'',
        sub_county:p.subCounty||p.sub_county||'',
        interest:p.interest||'',
        message:p.message||''
      }
    }

    if(type==='contact'){
      const name=p.fullName||p.name||''
      if(!name||!p.phone||!p.message){
        return res.status(400).json({error:'Please complete your name, phone number and message.'})
      }

      table='contact_submissions'
      record={
        full_name:name,
        email:p.email||'',
        phone:p.phone||'',
        subject:p.subject||'General enquiry',
        message:p.message||'',
        ward:p.ward||''
      }
    }

    if(type==='idea'){
      const idea=p.idea||p.message||''
      if(!idea){
        return res.status(400).json({error:'Please enter your idea or suggestion.'})
      }

      table='citizen_ideas'
      record={
        full_name:p.fullName||p.name||'',
        email:p.email||'',
        phone:p.phone||'',
        ward:p.ward||'',
        category:p.category||'General',
        idea
      }
    }

    if(type==='newsletter'){
      if(!p.email){
        return res.status(400).json({error:'Please enter an email address.'})
      }

      table='newsletter_subscribers'
      record={
        email:p.email||'',
        full_name:p.fullName||p.name||''
      }
    }

    const{data,error}=await supabase.from(table).insert(record).select('id').single()

    if(error){
      if(type==='newsletter'&&error.code==='23505'){
        return res.status(200).json({ok:true,alreadySubscribed:true})
      }
      console.error(`submission:${type}`,error)
      return res.status(500).json({
        error:'We could not save your information right now. Please try again shortly.'
      })
    }

    await audit('submission_created',table,data.id,{type})
    return res.status(201).json({ok:true,id:data.id,type})
  }catch(error){
    console.error('public submission:',error)
    return res.status(500).json({
      error:'We could not save your information right now. Please try again shortly.'
    })
  }
})


app.post('/api/admin/media/bulk-delete',adminOnly,async(req,res)=>{
  try{
    const ids=Array.isArray(req.body?.ids)?req.body.ids.filter(Boolean):[]
    if(!ids.length)return res.status(400).json({error:'No media items selected'})
    const{error}=await supabase.from('media_assets').delete().in('id',ids)
    if(error)throw error
    await audit('media_bulk_deleted','media_assets',null,{count:ids.length})
    res.json({ok:true,count:ids.length})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'Unable to delete selected media'})
  }
})


app.post('/api/admin/:kind/bulk-delete',adminOnly,async(req,res)=>{
  try{
    const map={news:'news_posts',events:'events',media:'media_assets'}
    const table=map[req.params.kind]
    if(!table)return res.status(400).json({error:'Unsupported bulk delete type'})
    const ids=Array.isArray(req.body?.ids)?req.body.ids.filter(Boolean):[]
    if(!ids.length)return res.status(400).json({error:'No items selected'})

    if(req.params.kind==='news'){
      await supabase.from('news_images').delete().in('news_id',ids)
    }
    if(req.params.kind==='events'){
      await supabase.from('event_images').delete().in('event_id',ids)
    }

    const{error}=await supabase.from(table).delete().in('id',ids)
    if(error)throw error
    await audit(`${req.params.kind}_bulk_deleted`,table,null,{count:ids.length})
    res.json({ok:true,count:ids.length})
  }catch(e){
    console.error(e)
    res.status(500).json({error:'Unable to delete selected items'})
  }
})

app.get('/api/admin/dashboard',adminOnly,async(_req,res)=>{try{const tables=['contact_submissions','volunteer_submissions','citizen_ideas','newsletter_subscribers','news_posts','events','media_assets','homepage_slides','event_images','news_images'];const result={};for(const table of tables){const{count,error}=await supabase.from(table).select('*',{count:'exact',head:true});if(error)throw error;result[table]=count||0}res.json(result)}catch(e){console.error(e);res.status(500).json({error:'Unable to load dashboard'})}})
app.get('/api/admin/submissions',adminOnly,async(_req,res)=>{try{const qs=await Promise.all(['contact_submissions','volunteer_submissions','citizen_ideas','newsletter_subscribers'].map(t=>supabase.from(t).select('*').order('created_at',{ascending:false})));const err=qs.find(q=>q.error)?.error;if(err)throw err;const rows=[...(qs[0].data||[]).map(r=>normalize('contact',r)),...(qs[1].data||[]).map(r=>normalize('volunteer',r)),...(qs[2].data||[]).map(r=>normalize('idea',r)),...(qs[3].data||[]).map(r=>normalize('newsletter',r))].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt));res.json(rows)}catch(e){console.error(e);res.status(500).json({error:'Unable to load submissions'})}})
app.patch('/api/admin/submissions/:type/:id',adminOnly,async(req,res)=>{try{const map={contact:'contact_submissions',volunteer:'volunteer_submissions',idea:'citizen_ideas',newsletter:'newsletter_subscribers'},table=map[req.params.type];if(!table)return res.status(400).json({error:'Invalid type'});const status=['new','reviewed','closed'].includes(String(req.body.status))?String(req.body.status):'new';const{data,error}=await supabase.from(table).update({status}).eq('id',req.params.id).select().single();if(error)throw error;await audit('submission_status_changed',table,data.id,{status});res.json(normalize(req.params.type,data))}catch(e){console.error(e);res.status(500).json({error:'Unable to update submission'})}})
app.put('/api/admin/content',adminOnly,async(req,res)=>{try{const p=clean(req.body),rows=Object.entries(p).map(([content_key,content_value])=>({content_key,content_value:String(content_value),updated_at:new Date().toISOString()}));const{error}=await supabase.from('campaign_content').upsert(rows,{onConflict:'content_key'});if(error)throw error;await audit('campaign_content_updated','campaign_content',null,{fields:Object.keys(p)});res.json(await contentObject())}catch(e){console.error(e);res.status(500).json({error:'Unable to save content'})}})

function crud(table,kind){
  app.get(`/api/admin/${kind}`,adminOnly,async(_req,res)=>{
    const{data,error}=await supabase.from(table).select('*').order('created_at',{ascending:false})
    if(error)return res.status(500).json({error:error.message})
    res.json(data||[])
  })

  app.post(`/api/admin/${kind}`,adminOnly,async(req,res)=>{
    const p=clean(req.body)
    p.published=String(req.body?.published||'false')==='true'
    const{data,error}=await supabase.from(table).insert(p).select().single()
    if(error)return res.status(500).json({error:error.message})
    await audit(`${kind}_created`,table,data.id)
    res.status(201).json(data)
  })

  app.put(`/api/admin/${kind}/:id`,adminOnly,async(req,res)=>{
    const p=clean(req.body)
    p.published=String(req.body?.published||'false')==='true'
    p.updated_at=new Date().toISOString()
    const{data,error}=await supabase.from(table).update(p).eq('id',req.params.id).select().single()
    if(error)return res.status(500).json({error:error.message})
    await audit(`${kind}_updated`,table,data.id)
    res.json(data)
  })

  app.delete(`/api/admin/${kind}/:id`,adminOnly,async(req,res)=>{
    const{error}=await supabase.from(table).delete().eq('id',req.params.id)
    if(error)return res.status(500).json({error:error.message})
    await audit(`${kind}_deleted`,table,req.params.id)
    res.json({ok:true})
  })
}
crud('news_posts','news'); crud('events','events'); crud('media_assets','media')
app.get('/api/admin/audit',adminOnly,async(_req,res)=>{const{data,error}=await supabase.from('audit_logs').select('*').order('created_at',{ascending:false}).limit(200);if(error)return res.status(500).json({error:error.message});res.json(data||[])})

app.post(
  '/api/admin/upload',
  adminOnly,
  upload.single('file'),
  async (req,res)=>{
    try{
      if(!req.file)return res.status(400).json({error:'Choose a JPG, PNG, WEBP, GIF or PDF file.'})

      const ext=path.extname(req.file.originalname||'')
      const base=safeFileName(path.basename(req.file.originalname||'upload',ext))||'upload'
      const objectPath=`${new Date().getUTCFullYear()}/${Date.now()}-${crypto.randomUUID()}-${base}${ext}`

      const{error}=await supabase.storage
        .from('campaign-media')
        .upload(objectPath,req.file.buffer,{
          contentType:req.file.mimetype,
          upsert:false,
          cacheControl:'3600'
        })

      if(error)throw error

      const{data}=supabase.storage.from('campaign-media').getPublicUrl(objectPath)

      await audit('media_uploaded','storage.objects',objectPath,{
        mime:req.file.mimetype,
        size:req.file.size
      })

      res.status(201).json({ok:true,path:objectPath,url:data.publicUrl})
    }catch(e){
      console.error('upload:',e)
      res.status(500).json({error:'Unable to upload file to Supabase Storage'})
    }
  }
)

// Phase 21: dynamic homepage slideshow
app.get('/api/homepage-slides',async(_req,res)=>{const{data,error}=await supabase.from('homepage_slides').select('*').eq('is_active',true).order('sort_order',{ascending:true}).order('created_at',{ascending:true});if(error)return res.status(500).json({error:error.message});res.json((data||[]).filter(x=>typeof x.image_url==='string'&&(x.image_url.startsWith('http://')||x.image_url.startsWith('https://')||x.image_url.startsWith('/'))))})
app.get('/api/admin/slides',adminOnly,async(_req,res)=>{const{data,error}=await supabase.from('homepage_slides').select('*').order('sort_order',{ascending:true}).order('created_at',{ascending:true});res.status(error?500:200).json(error?{error:error.message}:data||[])})
app.post('/api/admin/slides',adminOnly,async(req,res)=>{const p=clean(req.body);const row={image_url:p.image_url||'',alt_text:p.alt_text||'',sort_order:Number(p.sort_order||0),is_active:String(req.body?.is_active??'true')!=='false'};const{data,error}=await supabase.from('homepage_slides').insert(row).select().single();if(error)return res.status(500).json({error:error.message});await audit('slide_created','homepage_slides',data.id);res.status(201).json(data)})
app.put('/api/admin/slides/:id',adminOnly,async(req,res)=>{const p=clean(req.body);const row={};if('image_url'in p)row.image_url=p.image_url;if('alt_text'in p)row.alt_text=p.alt_text;if('sort_order'in p)row.sort_order=Number(p.sort_order);if('is_active'in req.body)row.is_active=Boolean(req.body.is_active);const{data,error}=await supabase.from('homepage_slides').update(row).eq('id',req.params.id).select().single();if(error)return res.status(500).json({error:error.message});await audit('slide_updated','homepage_slides',data.id);res.json(data)})
app.delete('/api/admin/slides/:id',adminOnly,async(req,res)=>{const{error}=await supabase.from('homepage_slides').delete().eq('id',req.params.id);if(error)return res.status(500).json({error:error.message});await audit('slide_deleted','homepage_slides',req.params.id);res.json({ok:true})})
app.post('/api/admin/slides/reorder',adminOnly,async(req,res)=>{try{const ids=Array.isArray(req.body?.ids)?req.body.ids:[];for(let i=0;i<ids.length;i++){const{error}=await supabase.from('homepage_slides').update({sort_order:i}).eq('id',ids[i]);if(error)throw error}await audit('slides_reordered','homepage_slides',null,{count:ids.length});res.json({ok:true})}catch(e){console.error(e);res.status(500).json({error:'Unable to reorder slides'})}})


// Phase 25: unlimited news galleries
app.get('/api/news/:slug/images',async(req,res)=>{
  try{
    const{data:post,error:postError}=await supabase.from('news_posts').select('id').eq('slug',req.params.slug).eq('published',true).maybeSingle()
    if(postError)throw postError
    if(!post)return res.json([])
    const{data,error}=await supabase.from('news_images').select('*').eq('news_id',post.id).order('sort_order',{ascending:true}).order('created_at',{ascending:true})
    if(error)throw error
    res.json(data||[])
  }catch(e){console.error(e);res.status(500).json({error:'Unable to load news gallery'})}
})

app.get('/api/admin/news/:id/images',adminOnly,async(req,res)=>{
  const{data,error}=await supabase.from('news_images').select('*').eq('news_id',req.params.id).order('sort_order',{ascending:true}).order('created_at',{ascending:true})
  res.status(error?500:200).json(error?{error:error.message}:data||[])
})

app.post('/api/admin/news/:id/images',adminOnly,upload.array('files',50),async(req,res)=>{
  try{
    const files=Array.isArray(req.files)?req.files:[]
    if(!files.length)return res.status(400).json({error:'Choose one or more images'})
    const{count}=await supabase.from('news_images').select('*',{count:'exact',head:true}).eq('news_id',req.params.id)
    const rows=[]
    for(let i=0;i<files.length;i++){
      const stored=await uploadFileToCampaignMedia(files[i])
      rows.push({
        news_id:req.params.id,
        image_url:stored.url,
        caption:String(req.body?.caption||'').trim()||null,
        sort_order:(count||0)+i
      })
    }
    const{data,error}=await supabase.from('news_images').insert(rows).select()
    if(error)throw error
    await audit('news_gallery_uploaded','news_images',req.params.id,{count:files.length})
    res.status(201).json(data||[])
  }catch(e){console.error(e);res.status(500).json({error:'Unable to upload news photographs'})}
})

app.delete('/api/admin/news-images/:id',adminOnly,async(req,res)=>{
  const{error}=await supabase.from('news_images').delete().eq('id',req.params.id)
  if(error)return res.status(500).json({error:error.message})
  await audit('news_image_deleted','news_images',req.params.id)
  res.json({ok:true})
})

app.post('/api/admin/news/:id/images/reorder',adminOnly,async(req,res)=>{
  try{
    const ids=Array.isArray(req.body?.ids)?req.body.ids:[]
    for(let i=0;i<ids.length;i++){
      const{error}=await supabase.from('news_images').update({sort_order:i}).eq('id',ids[i]).eq('news_id',req.params.id)
      if(error)throw error
    }
    await audit('news_gallery_reordered','news_images',req.params.id,{count:ids.length})
    res.json({ok:true})
  }catch(e){console.error(e);res.status(500).json({error:'Unable to reorder news gallery'})}
})

// Phase 21: unlimited event galleries
app.get('/api/events/:id/images',async(req,res)=>{const{data,error}=await supabase.from('event_images').select('*').eq('event_id',req.params.id).order('sort_order',{ascending:true}).order('created_at',{ascending:true});res.status(error?500:200).json(error?{error:error.message}:data||[])})
app.get('/api/admin/events/:id/images',adminOnly,async(req,res)=>{const{data,error}=await supabase.from('event_images').select('*').eq('event_id',req.params.id).order('sort_order',{ascending:true}).order('created_at',{ascending:true});res.status(error?500:200).json(error?{error:error.message}:data||[])})
app.post('/api/admin/events/:id/images',adminOnly,upload.array('files',50),async(req,res)=>{try{const files=Array.isArray(req.files)?req.files:[];if(!files.length)return res.status(400).json({error:'Choose one or more images'});const{count}=await supabase.from('event_images').select('*',{count:'exact',head:true}).eq('event_id',req.params.id);const rows=[];for(let i=0;i<files.length;i++){const stored=await uploadFileToCampaignMedia(files[i]);rows.push({event_id:req.params.id,image_url:stored.url,caption:String(req.body?.caption||'').trim()||null,sort_order:(count||0)+i})}const{data,error}=await supabase.from('event_images').insert(rows).select();if(error)throw error;await audit('event_gallery_uploaded','event_images',req.params.id,{count:files.length});res.status(201).json(data||[])}catch(e){console.error(e);res.status(500).json({error:'Unable to upload event photographs'})}})
app.delete('/api/admin/event-images/:id',adminOnly,async(req,res)=>{const{error}=await supabase.from('event_images').delete().eq('id',req.params.id);if(error)return res.status(500).json({error:error.message});await audit('event_image_deleted','event_images',req.params.id);res.json({ok:true})})
app.post('/api/admin/events/:id/images/reorder',adminOnly,async(req,res)=>{try{const ids=Array.isArray(req.body?.ids)?req.body.ids:[];for(let i=0;i<ids.length;i++){const{error}=await supabase.from('event_images').update({sort_order:i}).eq('id',ids[i]).eq('event_id',req.params.id);if(error)throw error}await audit('event_gallery_reordered','event_images',req.params.id,{count:ids.length});res.json({ok:true})}catch(e){console.error(e);res.status(500).json({error:'Unable to reorder event gallery'})}})

app.get('/api/news/:slug',async(req,res)=>{
  try{
    const{data,error}=await supabase
      .from('news_posts')
      .select('*')
      .eq('slug',req.params.slug)
      .eq('published',true)
      .maybeSingle()

    if(error)throw error
    if(!data)return res.status(404).json({error:'News post not found'})
    res.json(data)
  }catch(e){
    console.error(e)
    res.status(500).json({error:'Unable to load news post'})
  }
})

app.get('/api/events/:id',async(req,res)=>{
  try{
    const{data,error}=await supabase
      .from('events')
      .select('*')
      .eq('id',req.params.id)
      .eq('published',true)
      .maybeSingle()

    if(error)throw error
    if(!data)return res.status(404).json({error:'Event not found'})
    res.json(data)
  }catch(e){
    console.error(e)
    res.status(500).json({error:'Unable to load event'})
  }
})

app.get('/api/news',async(_req,res)=>{const{data,error}=await supabase.from('news_posts').select('*').eq('published',true).order('published_at',{ascending:false});res.status(error?500:200).json(error?{error:error.message}:data||[])})
app.get('/api/events',async(_req,res)=>{const{data,error}=await supabase.from('events').select('*').eq('published',true).order('event_date',{ascending:true});res.status(error?500:200).json(error?{error:error.message}:data||[])})


app.get('/api/media-gallery',async(_req,res)=>{
  try{
    const [mediaR,eventR]=await Promise.all([
      supabase.from('media_assets')
        .select('id,file_url,thumbnail_url,title,description,asset_type,created_at')
        .eq('published',true)
        .eq('asset_type','photo')
        .order('created_at',{ascending:false}),
      supabase.from('event_images')
        .select('id,image_url,caption,created_at')
        .order('created_at',{ascending:false})
    ])

    const clean=(value='')=>{
      const text=String(value||'').trim()
      if(/^IMG[-_]/i.test(text)||/^\d{5,}$/.test(text))return ''
      return text
    }

    const gallery=[
      ...(mediaR.data||[]).map(x=>({
        id:x.id,
        image_url:x.thumbnail_url||x.file_url,
        caption:clean(x.title)||'Campaign photograph',
        description:x.description||'',
        source:'media',
        created_at:x.created_at
      })),
      ...(eventR.data||[]).map(x=>({
        id:x.id,
        image_url:x.image_url,
        caption:clean(x.caption)||'Campaign event',
        description:'',
        source:'event',
        created_at:x.created_at
      }))
    ].filter(x=>x.image_url && /^https?:\/\//.test(String(x.image_url)))

    res.json(gallery)
  }catch(e){
    console.error(e)
    res.status(500).json({error:'Unable to load media gallery'})
  }
})

app.get('/api/gallery',async(_req,res)=>{try{const [a,b,c]=await Promise.all([supabase.from('homepage_slides').select('id,image_url,alt_text,created_at').eq('is_active',true).order('sort_order',{ascending:true}),supabase.from('media_assets').select('id,file_url,thumbnail_url,title,asset_type,created_at').eq('published',true).eq('asset_type','photo').order('created_at',{ascending:false}),supabase.from('event_images').select('id,image_url,caption,created_at').order('created_at',{ascending:false})]);const valid=v=>typeof v==='string'&&(v.startsWith('http://')||v.startsWith('https://')||v.startsWith('/'));const rows=[...(a.data||[]).map(x=>({id:x.id,image_url:x.image_url,caption:x.alt_text||'Campaign slideshow',source:'slideshow'})),...(b.data||[]).map(x=>({id:x.id,image_url:x.thumbnail_url||x.file_url,caption:x.title||'Campaign media',source:'media'})),...(c.data||[]).map(x=>({id:x.id,image_url:x.image_url,caption:x.caption||'Campaign event',source:'event'}))].filter(x=>valid(x.image_url));res.json(rows)}catch(e){console.error(e);res.status(500).json({error:'Unable to load gallery'})}})

app.delete('/api/admin/media/broken',adminOnly,async(_req,res)=>{try{const{data,error}=await supabase.from('media_assets').select('id,file_url,thumbnail_url').eq('asset_type','photo');if(error)throw error;const valid=v=>typeof v==='string'&&(v.startsWith('http://')||v.startsWith('https://')||v.startsWith('/'));const ids=(data||[]).filter(x=>!valid(x.thumbnail_url||x.file_url)).map(x=>x.id);if(ids.length){const{error:delError}=await supabase.from('media_assets').delete().in('id',ids);if(delError)throw delError}res.json({ok:true,removed:ids.length})}catch(e){console.error(e);res.status(500).json({error:'Unable to clean broken media records'})}})

app.get('/api/media',async(_req,res)=>{const{data,error}=await supabase.from('media_assets').select('*').eq('published',true).order('created_at',{ascending:false});res.status(error?500:200).json(error?{error:error.message}:data||[])})

const distDir=path.join(__dirname,'dist');app.use(express.static(distDir,{maxAge:NODE_ENV==='production'?'1h':0,etag:true}));app.get('*',(_req,res)=>res.sendFile(path.join(distDir,'index.html'),e=>{if(e)res.status(503).send('Frontend build not found. Run npm run build first.')}));
app.listen(PORT,'0.0.0.0',()=>{console.log(`Philip Kaloki Supabase CMS running on port ${PORT}`);console.log(`Database: ${SUPABASE_URL}`)})
