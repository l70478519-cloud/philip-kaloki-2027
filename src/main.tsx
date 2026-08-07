import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ArrowRight, CalendarDays, CheckCircle2, ChevronUp, Droplets,
  HeartHandshake, Camera as Instagram, Landmark, Mail, MapPin, Menu, MessageCircle, Megaphone,
  Newspaper, Phone, PlayCircle, ShieldCheck, Sprout, Stethoscope, Target, FileText, Download,
  Users, X, PlayCircle as Youtube, BriefcaseBusiness, GraduationCap, LockKeyhole, LayoutDashboard,
  Inbox, Save, Home as HomeIcon, LogOut, Settings, Eye, Check, Clock3, ExternalLink, Image as ImageIcon, FileCheck2, BarChart3, Plus, Trash2, RefreshCw, Activity, Calendar, Database, Edit3, Music2, Share2, ArrowUp, ArrowDown
} from 'lucide-react'
import './styles.css'

function FacebookIcon({size=20}:{size?:number}) { return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.5 22v-9h3l.45-3.5H13.5V7.26c0-1.01.28-1.7 1.73-1.7H17V2.43c-.31-.04-1.38-.13-2.62-.13-2.59 0-4.36 1.58-4.36 4.48V9.5H7v3.5h3.02v9h3.48z"/></svg> }

type Content = {
  candidateName: string
  campaignTitle: string
  tagline: string
  strapline: string
  phone: string
  email: string
  whatsapp: string
  office: string
  heroText: string
  biography: string
  facebook: string
  twitter: string
  instagram: string
  tiktok: string
  youtube: string
  contentStatus: string
  heroImage1: string
  heroImage2: string
  heroImage3: string
  aboutImage: string
  candidateCardImage: string
}

function cleanPublicCaption(value?: string) {
  const text = String(value || '').trim()
  if (!text) return 'Campaign photograph'
  if (/^IMG[-_]/i.test(text)) return 'Campaign photograph'
  if (/^\d{5,}$/.test(text)) return 'Campaign photograph'
  return text
}


type LiveNewsPost = {
  id: string
  title: string
  slug?: string
  summary?: string
  body?: string
  image_url?: string
  category?: string
  published?: boolean
  published_at?: string
  created_at?: string
}

type LiveEvent = {
  id: string
  title: string
  description?: string
  venue?: string
  ward?: string
  event_date?: string
  image_url?: string
  published?: boolean
  created_at?: string
}

type LiveMediaAsset = {
  id: string
  title?: string
  description?: string
  asset_type?: string
  file_url?: string
  thumbnail_url?: string
  published?: boolean
  created_at?: string
}


type HomeSlide = {
  id: string
  image_url: string
  alt_text?: string
  description?: string
  sort_order: number
  is_active: boolean
}

type EventImage = {
  id: string
  event_id: string
  image_url: string
  caption?: string
  sort_order: number
  created_at?: string
}

type NewsImage = {
  id: string
  news_id: string
  image_url: string
  caption?: string
  sort_order: number
  created_at?: string
}

function useLiveApi<T>(url: string, fallback: T) {
  const [data, setData] = React.useState<T>(fallback)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    fetch(url)
      .then(r => r.ok ? r.json() : fallback)
      .then(next => {
        if (active) setData(next)
      })
      .catch(() => {
        if (active) setData(fallback)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [url])

  return { data, loading }
}

type Submission = Record<string, string> & { id: string; type: string; createdAt: string; status: string }

const fallbackContent: Content = {
  candidateName: 'Prof. Philip Kaloki', campaignTitle: 'Makueni County • 2027', tagline: 'Development. Integrity. Prosperity.',
  strapline: 'Leadership that listens. Development that reaches every household.', phone: '+254 700 000 000',
  email: 'info@philipkaloki.com', whatsapp: '254700000000', office: 'Wote, Makueni County',
  heroText: 'A people-centred movement committed to practical solutions, accountable leadership and opportunity for every family in Makueni County.',
  biography: 'Prof. Philip Kaloki’s leadership journey is founded on public service, professional excellence and a deep commitment to improving lives. His 2027 agenda places communities at the centre of county development.',
  facebook: '#', twitter: '#', instagram: '#', tiktok: '#', youtube: '#', contentStatus: 'Replace placeholder contact details and campaign wording with formally approved information before public launch.',
  heroImage1: '/assets/philip-kaloki-portrait-hero.webp',
  heroImage2: '/assets/philip-kaloki-field.webp',
  heroImage3: '/assets/philip-kaloki-media-wide.webp',
  aboutImage: '/assets/philip-kaloki-office.webp',
  candidateCardImage: '/assets/philip-kaloki-candidate-card.webp'
}

const priorities = [
  { icon: <Sprout/>, title: 'Agriculture & Markets', text: 'Support farmers from production to market through irrigation, extension services and value addition.' },
  { icon: <Droplets/>, title: 'Water & Irrigation', text: 'Expand access to clean water while investing in practical climate-smart irrigation systems.' },
  { icon: <Stethoscope/>, title: 'Quality Healthcare', text: 'Build a dependable county health system with medicine, equipment and dignified care.' },
  { icon: <BriefcaseBusiness/>, title: 'Jobs & Enterprise', text: 'Create a supportive environment for local businesses, cooperatives and emerging industries.' },
  { icon: <GraduationCap/>, title: 'Youth & Education', text: 'Connect young people to skills, mentorship, technology and opportunity.' },
  { icon: <Landmark/>, title: 'Accountable Government', text: 'Restore public trust through transparent budgets, citizen participation and measurable delivery.' }
]

const news = [
  { title: 'Listening to priorities from every ward', tag: 'Community Listening', image: '/assets/philip-kaloki-media.webp' },
  { title: 'Household-centred county development', tag: 'Development Agenda', image: '/assets/philip-kaloki-field.webp' },
  { title: 'Building an organised grassroots movement', tag: 'Volunteer Network', image: '/assets/philip-kaloki-office.webp' }
]

function useContent() {
  const [content, setContent] = React.useState<Content>(fallbackContent)
  React.useEffect(() => { fetch('/api/content').then(r => r.ok ? r.json() : {}).then(data => setContent({ ...fallbackContent, ...data })).catch(() => setContent(fallbackContent)) }, [])
  return content
}

async function submit(type: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/submissions/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error('Submission failed')
  return res.json()
}

function validSocial(url?: string) {
  return Boolean(url && url !== '#' && /^https?:\/\//i.test(url))
}

function SocialLinks({ content, compact = false }: { content: Content; compact?: boolean }) {
  const links = [
    { url: content.facebook, label: 'Facebook', icon: <FacebookIcon/> },
    { url: content.twitter, label: 'X', icon: <X/> },
    { url: content.instagram, label: 'Instagram', icon: <Instagram/> },
    { url: content.tiktok, label: 'TikTok', icon: <Music2/> },
    { url: content.youtube, label: 'YouTube', icon: <Youtube/> }
  ].filter(item => validSocial(item.url))

  if (!links.length) return null
  return <div className={compact ? 'socials top-socials' : 'socials'}>
    {links.map(item => <a key={item.label} href={item.url} target="_blank" rel="noreferrer" aria-label={item.label}>{item.icon}</a>)}
  </div>
}

function setDetailMeta(title: string, description: string, image?: string) {
  document.title = `${title} | Prof. Philip Kaloki`
  const set = (property: string, value: string) => {
    let node = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
    if (!node) { node = document.createElement('meta'); node.setAttribute('property', property); document.head.appendChild(node) }
    node.content = value
  }
  set('og:title', title)
  set('og:description', description)
  if (image) set('og:image', image)
}

function CandidateReminder({ content }: { content: Content }) {
  return <aside className="candidate-reminder">
    <img src={content.candidateCardImage || fallbackContent.candidateCardImage} alt={content.candidateName}/>
    <div className="candidate-reminder-copy">
      <small>VYING FOR</small>
      <strong>GOVERNOR</strong>
      <span>Makueni County • 2027</span>
      <p>{content.strapline}</p>
      <a href="/agenda">View the development agenda <ArrowRight size={15}/></a>
    </div>
  </aside>
}

function Layout({ children, content }: { children: React.ReactNode; content: Content }) {
  const [open, setOpen] = React.useState(false)
  const [showTop, setShowTop] = React.useState(false)
  React.useEffect(() => { const f = () => setShowTop(window.scrollY > 600); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f) }, [])
  const links = [['/','Home'],['/about','About'],['/agenda','Agenda'],['/news','News'],['/events','Events'],['/media','Media'],['/contact','Contact']]
  return <div>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="topbar"><div className="container topbar-inner"><div className="topbar-message"><span>{content.strapline}</span><SocialLinks content={content} compact/></div><div className="topbar-contact"><a href={`tel:${content.phone.replace(/\s+/g,'')}`}><Phone size={15}/> {content.phone}</a><a href={`mailto:${content.email}`}><Mail size={15}/> {content.email}</a></div></div></div>
    <header className="header"><div className="container nav">
      <a className="brand" href="/"><span className="brand-mark">PK</span><span><strong>{content.candidateName.toUpperCase()}</strong><small>{content.campaignTitle.toUpperCase()}</small></span></a>
      <nav className={open ? 'nav-links open' : 'nav-links'}>{links.map(([href,label]) => <a key={href} href={href}>{label}</a>)}<a href="/volunteer" className="nav-cta">Join the Movement</a></nav>
      <button className="menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div></header>
    <main id="main-content">{children}</main>
    <a className="whatsapp" href={`https://wa.me/${content.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle/></a>
    {showTop && <button className="back-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}><ChevronUp/></button>}
    <footer><div className="container footer-main">
      <div><div className="brand footer-brand"><span className="brand-mark">PK</span><span><strong>{content.candidateName.toUpperCase()}</strong><small>{content.campaignTitle.toUpperCase()}</small></span></div><p>{content.tagline} for every household.</p></div>
      <div><h4>Quick links</h4><a href="/about">About</a><a href="/agenda">Development agenda</a><a href="/news">News & updates</a><a href="/media">Media centre</a><a href="/volunteer">Volunteer</a></div>
      <div><h4>Contact</h4><span>{content.office}</span><a href={`tel:${content.phone.replace(/\s+/g,'')}`}>{content.phone}</a><a href={`mailto:${content.email}`}>{content.email}</a></div>
      <div><h4>Follow</h4><SocialLinks content={content}/></div>
    </div><div className="container footer-bottom"><small>© 2027 Philip Kaloki Campaign.</small><small><a href="/privacy">Privacy</a> • <a href="/terms">Terms</a> • <a href="/accessibility">Accessibility</a></small></div></footer>
  </div>
}

function PageHero({ kicker, title, text, image }: { kicker: string; title: string; text: string; image?: string }) {
  return <section className="page-hero"><div className="container page-hero-grid"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{text}</p></div>{image && <img src={image} alt=""/>}</div></section>
}


function HeroSlideshow({ content }: { content: Content }) {
  const fallbackSlides: HomeSlide[] = [
    { id: 'fallback-1', image_url: content.heroImage1 || fallbackContent.heroImage1, alt_text: 'Leadership for Makueni', sort_order: 0, is_active: true },
    { id: 'fallback-2', image_url: content.heroImage2 || fallbackContent.heroImage2, alt_text: 'Listening across the county', sort_order: 1, is_active: true },
    { id: 'fallback-3', image_url: content.heroImage3 || fallbackContent.heroImage3, alt_text: 'A people-centred campaign', sort_order: 2, is_active: true }
  ].filter(slide => Boolean(slide.image_url))

  const [remoteSlides, setRemoteSlides] = React.useState<HomeSlide[]>([])
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/homepage-slides')
      .then(r => r.ok ? r.json() : [])
      .then(data => setRemoteSlides(Array.isArray(data) ? data : []))
      .catch(() => setRemoteSlides([]))
  }, [])

  const slides = remoteSlides.length ? remoteSlides : fallbackSlides

  React.useEffect(() => {
    if (paused || slides.length <= 1) return
    const timer = window.setInterval(() => setActive(current => (current + 1) % slides.length), 5000)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  React.useEffect(() => { if (active >= slides.length) setActive(0) }, [active, slides.length])
  if (!slides.length) return null

  return <div className="hero-slideshow" aria-label="Campaign image slideshow" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)}>
    <div className="hero-slide-stage">
      {slides.map((slide,index)=><figure key={slide.id} className={index===active?'hero-slide active':'hero-slide'}>
        <img src={slide.image_url} alt={slide.alt_text || `Campaign photograph ${index+1}`}/>
        <figcaption><strong>{content.candidateName}</strong><span>{slide.alt_text || content.strapline}</span></figcaption>
      </figure>)}
    </div>
    {slides.length>1&&<><button className="slide-control previous" aria-label="Previous campaign image" onClick={()=>setActive(current=>(current-1+slides.length)%slides.length)}>‹</button><button className="slide-control next" aria-label="Next campaign image" onClick={()=>setActive(current=>(current+1)%slides.length)}>›</button><div className="slide-dots">{slides.map((slide,index)=><button key={slide.id} className={index===active?'active':''} aria-label={`Show image ${index+1}`} onClick={()=>setActive(index)}/>)}</div></>}
  </div>
}

function HomePage({ content }: { content: Content }) {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow">A NEW CHAPTER FOR MAKUENI</div><h1>Development.<br/><span>Integrity.</span><br/>Prosperity.</h1><p>{content.heroText}</p><div className="hero-actions"><a className="btn primary" href="/agenda">Explore the Agenda <ArrowRight size={18}/></a><a className="btn secondary" href="/volunteer">Become a Volunteer</a></div><div className="trust-row"><span><CheckCircle2/> Experienced leadership</span><span><CheckCircle2/> People-first development</span></div></div><HeroSlideshow content={content}/></div></section>
    <section className="quick-impact"><div className="container impact-grid"><div><strong>30</strong><span>Wards to be heard</span></div><div><strong>6</strong><span>Core priorities</span></div><div><strong>1</strong><span>United county vision</span></div><div><strong>Every</strong><span>Household matters</span></div></div></section>
    <section className="statement"><div className="container statement-grid"><div><span>OUR COMMITMENT</span><h2>A government that works for the people.</h2></div><p>Progress must be visible in ordinary lives—in working hospitals, productive farms, thriving businesses, empowered young people and institutions that serve with integrity.</p></div></section>
    <section className="section"><div className="container split"><div className="image-panel about-photo"><img src={content.aboutImage || fallbackContent.aboutImage} alt="Prof. Philip Kaloki"/><div className="image-label">Leadership • Service • Results</div></div><div className="content"><div className="section-kicker">MEET THE CANDIDATE</div><h2>Proven leadership with a clear vision for Makueni.</h2><p>{content.biography}</p><div className="mini-points"><div><ShieldCheck/><span><strong>Integrity in leadership</strong><small>Transparent decisions and responsible use of public resources.</small></span></div><div><Users/><span><strong>Inclusive development</strong><small>Every ward, village and household must participate in Makueni’s progress.</small></span></div><div><Target/><span><strong>Measurable delivery</strong><small>Clear priorities and published progress.</small></span></div></div><a className="text-link" href="/about">Read full profile <ArrowRight size={17}/></a></div></div></section>
    <section className="vision-section"><div className="container center-heading"><div className="section-kicker light">THE 2027 DEVELOPMENT AGENDA</div><h2>Practical priorities. Visible results.</h2></div><div className="container cards six-cards">{priorities.map(p => <article className="pillar" key={p.title}><div className="icon-wrap">{p.icon}</div><h3>{p.title}</h3><p>{p.text}</p></article>)}</div><div className="container home-more"><a className="btn secondary" href="/agenda">Read the Full Agenda <ArrowRight size={17}/></a></div></section>
    <section className="updates-section section"><div className="container section-heading-row"><div><div className="section-kicker">LATEST FROM THE MOVEMENT</div><h2>Updates and conversations.</h2></div><a className="text-link" href="/news">View all updates <ArrowRight size={17}/></a></div><div className="container update-grid">{news.map(item => <article className="update-card" key={item.title}><div className="update-image photo-update"><img src={item.image} alt=""/></div><div className="update-body"><span>{item.tag}</span><small><CalendarDays/> Campaign update</small><h3>{item.title}</h3><p>Read the latest campaign brief, community engagement update and development conversation.</p><a href="/news">Read more <ArrowRight size={15}/></a></div></article>)}</div></section>
    <section className="participate-section section"><div className="container center-heading"><div className="section-kicker light">GET INVOLVED</div><h2>There is a place for every supporter.</h2></div><div className="container participate-grid"><article><Users/><span>01</span><h3>Volunteer</h3><p>Support outreach, events and local engagement.</p><a href="/volunteer">Register interest <ArrowRight size={15}/></a></article><article><Megaphone/><span>02</span><h3>Host a dialogue</h3><p>Invite the campaign to a community conversation.</p><a href="/contact">Send invitation <ArrowRight size={15}/></a></article><article><FileText/><span>03</span><h3>Share policy ideas</h3><p>Send practical proposals for Makueni.</p><a href="/contact">Share an idea <ArrowRight size={15}/></a></article><article><Newspaper/><span>04</span><h3>Media requests</h3><p>Request interviews or campaign information.</p><a href="/media">Media centre <ArrowRight size={15}/></a></article></div></section>
    <NewsletterSection />
  </>
}

function AboutPage({ content }: { content: Content }) {
  return <><PageHero kicker="ABOUT PROF. PHILIP KALOKI" title="Leadership grounded in service." text={content.biography} image="/assets/philip-kaloki-office.webp"/><section className="section"><div className="container leadership-grid"><div className="leadership-photo"><img src="/assets/philip-kaloki-media.webp" alt="Prof. Philip Kaloki engaging the media"/><div className="leadership-badge"><strong>Prof. Philip Kaloki</strong><span>Leadership • Service • Results</span></div></div><div className="leadership-copy"><div className="section-kicker">LEADERSHIP PROFILE</div><h2>A people-first approach to county leadership.</h2><p>{content.biography}</p><div className="principle-grid"><article><ShieldCheck/><div><strong>Integrity</strong><span>Transparent decisions and responsible use of public resources.</span></div></article><article><Users/><div><strong>Inclusion</strong><span>Every ward and community has a voice in development.</span></div></article><article><Target/><div><strong>Delivery</strong><span>Clear commitments, timelines and visible outcomes.</span></div></article><article><HeartHandshake/><div><strong>Service</strong><span>Leadership measured by improvements in everyday life.</span></div></article></div></div></div></section></>
}

function AgendaPage() {
  return <><PageHero kicker="THE 2027 DEVELOPMENT AGENDA" title="A practical plan for every household." text="Six connected priorities designed around household prosperity, dependable public services and accountable government." image="/assets/philip-kaloki-field.webp"/><section className="vision-section"><div className="container cards six-cards">{priorities.map((p,i) => <article className="pillar" key={p.title}><span className="agenda-number">0{i+1}</span><div className="icon-wrap">{p.icon}</div><h3>{p.title}</h3><p>{p.text}</p><ul><li><CheckCircle2/> Ward-linked implementation</li><li><CheckCircle2/> Clear performance indicators</li><li><CheckCircle2/> Public progress reporting</li></ul></article>)}</div></section><section className="manifesto-section section"><div className="container manifesto-layout"><div className="manifesto-intro"><div className="section-kicker">THE PEOPLE'S MANIFESTO</div><h2>A clear contract between leadership and citizens.</h2><p>Approved policy documents can be published here as the campaign finalises them.</p><a className="btn primary" href="/contact">Request a policy brief</a></div><div className="manifesto-list">{['Household Prosperity','Reliable Essential Services','Opportunity for Young People','Transparent County Government'].map((x,i)=><article key={x}><span>0{i+1}</span><div><h3>{x}</h3><p>Measurable commitments linked to ward-level priorities and county-wide results.</p></div></article>)}</div></div></section></>
}

function NewsPage(){
  const { data: posts, loading } = useLiveApi<LiveNewsPost[]>('/api/news', [])
  return <main className="inner-page">
    <section className="page-hero compact">
      <div className="container">
        <span className="section-kicker">Campaign newsroom</span>
        <h1>News & Updates</h1>
        <p>Latest campaign announcements, policy updates and community engagement from across Makueni County.</p>
      </div>
    </section>
    <section className="section">
      <div className="container">
        {loading ? <div className="cms-empty public-empty">Loading latest updates…</div> :
        posts.length === 0 ? <div className="cms-empty public-empty"><Newspaper/><h3>No published news yet</h3><p>Published stories created in the campaign CMS will appear here automatically.</p></div> :
        <div className="live-news-grid">
          {posts.map(post => <article className="live-news-card" key={post.id}>
            {post.image_url && <img src={post.image_url} alt="" loading="lazy"/>}
            <div className="live-news-copy">
              <span>{post.category || 'Campaign Update'}</span>
              <h2>{post.title}</h2>
              <p>{post.summary || post.body || ''}</p>
              <div className="live-card-actions">
                {post.published_at && <small>{new Date(post.published_at).toLocaleDateString()}</small>}
                {post.slug && <a href={`/news/${post.slug}`}>Read full article →</a>}
              </div>
            </div>
          </article>)}
        </div>}
      </div>
    </section>
  </main>
}



function NewsDetailPage({ slug, content }: { slug: string; content: Content }) {
  const [post,setPost]=React.useState<LiveNewsPost|null>(null)
  const [images,setImages]=React.useState<NewsImage[]>([])
  const [selected,setSelected]=React.useState<NewsImage|null>(null)
  const [loading,setLoading]=React.useState(true)
  React.useEffect(()=>{Promise.all([
    fetch(`/api/news/${encodeURIComponent(slug)}`).then(r=>r.ok?r.json():null),
    fetch(`/api/news/${encodeURIComponent(slug)}/images`).then(r=>r.ok?r.json():[])
  ]).then(([data,imageData])=>{setPost(data);setImages(Array.isArray(imageData)?imageData:[]);if(data)setDetailMeta(data.title,data.summary||data.body||content.strapline,data.image_url)}).catch(()=>setPost(null)).finally(()=>setLoading(false))},[slug,content.strapline])
  if(loading)return <main className="inner-page"><section className="section"><div className="container"><div className="public-empty">Loading article…</div></div></section></main>
  if(!post)return <NotFoundPage/>
  return <main className="inner-page"><section className="article-hero"><div className="container article-title-wrap"><div><span className="section-kicker">{post.category||'Campaign Update'}</span><h1>{post.title}</h1>{post.published_at&&<p className="article-meta">{new Date(post.published_at).toLocaleString()}</p>}</div><CandidateReminder content={content}/></div></section><article className="section"><div className="container detail-layout"><div className="article-wrap">{post.image_url&&<img className="article-cover" src={post.image_url} alt={post.title}/>} {post.summary&&<p className="article-summary">{post.summary}</p>}<div className="article-body">{(post.body||'').split('\n').map((p,i)=><p key={i}>{p}</p>)}</div>{images.length>0&&<section className="event-public-gallery"><div className="section-kicker">NEWS PHOTO GALLERY</div><h2>More from this story</h2><div className="event-mini-gallery">{images.map((img,index)=><button key={img.id} onClick={()=>setSelected(img)}><img src={img.image_url} alt={img.caption||`News photograph ${index+1}`} loading="lazy"/><span>{cleanPublicCaption(img.caption||`Photo ${index+1}`)}</span></button>)}</div></section>}<div className="detail-share"><Share2/><span>Share this update through the campaign social channels.</span><SocialLinks content={content}/></div><a className="detail-link" href="/news">← Back to news</a></div><div className="detail-aside"><CandidateReminder content={content}/></div></div></article>{selected&&<div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}><button aria-label="Close gallery" onClick={()=>setSelected(null)}><X/></button><img src={selected.image_url} alt={selected.caption||'News photograph'}/>{selected.caption&&<p>{selected.caption}</p>}</div>}</main>
}

function EventDetailPage({ id, content }: { id: string; content: Content }) {
  const [event,setEvent]=React.useState<LiveEvent|null>(null)
  const [images,setImages]=React.useState<EventImage[]>([])
  const [selected,setSelected]=React.useState<EventImage|null>(null)
  const [loading,setLoading]=React.useState(true)
  React.useEffect(()=>{Promise.all([fetch(`/api/events/${encodeURIComponent(id)}`).then(r=>r.ok?r.json():null),fetch(`/api/events/${encodeURIComponent(id)}/images`).then(r=>r.ok?r.json():[])]).then(([eventData,imageData])=>{setEvent(eventData);setImages(Array.isArray(imageData)?imageData:[]);if(eventData)setDetailMeta(eventData.title,eventData.description||content.strapline,eventData.image_url)}).catch(()=>setEvent(null)).finally(()=>setLoading(false))},[id,content.strapline])
  if(loading)return <main className="inner-page"><section className="section"><div className="container"><div className="public-empty">Loading event…</div></div></section></main>
  if(!event)return <NotFoundPage/>
  return <main className="inner-page"><section className="article-hero"><div className="container article-title-wrap"><div><span className="section-kicker">Campaign Event</span><h1>{event.title}</h1>{event.event_date&&<p className="article-meta">{new Date(event.event_date).toLocaleString()}</p>}</div><CandidateReminder content={content}/></div></section><section className="section"><div className="container detail-layout"><div className="article-wrap">{event.image_url&&<img className="article-cover" src={event.image_url} alt={event.title}/>}<div className="event-detail-card"><strong>Location</strong><p>{[event.venue,event.ward].filter(Boolean).join(' • ')||'Venue to be announced'}</p></div><div className="article-body"><p>{event.description||''}</p></div>{images.length>0&&<section className="event-public-gallery"><div className="section-kicker">EVENT PHOTO GALLERY</div><h2>Moments from this event</h2><div className="event-mini-gallery">{images.map((img,index)=><button key={img.id} onClick={()=>setSelected(img)}><img src={img.image_url} alt={img.caption||`Event photograph ${index+1}`} loading="lazy"/><span>{img.caption||`Photo ${index+1}`}</span></button>)}</div></section>}<a className="detail-link" href="/events">← Back to events</a></div><div className="detail-aside"><CandidateReminder content={content}/></div></div></section>{selected&&<div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}><button aria-label="Close gallery" onClick={()=>setSelected(null)}><X/></button><img src={selected.image_url} alt={selected.caption||'Event photograph'}/>{selected.caption&&<p>{selected.caption}</p>}</div>}</main>
}

function EventsPage(){
  const { data: events, loading } = useLiveApi<LiveEvent[]>('/api/events', [])
  return <main className="inner-page">
    <section className="page-hero compact">
      <div className="container">
        <span className="section-kicker">Campaign calendar</span>
        <h1>Events</h1>
        <p>Upcoming public meetings, forums and campaign engagements across Makueni County.</p>
      </div>
    </section>
    <section className="section">
      <div className="container">
        {loading ? <div className="cms-empty public-empty">Loading events…</div> :
        events.length === 0 ? <div className="cms-empty public-empty"><CalendarDays/><h3>No published events yet</h3><p>Events created and published from the campaign CMS will appear here automatically.</p></div> :
        <div className="live-events-grid">
          {events.map(event => <article className="live-event-card" key={event.id}>
            <div className="live-event-date">{event.event_date ? new Date(event.event_date).toLocaleDateString(undefined,{month:'short',day:'2-digit'}) : 'TBA'}</div>
            <div><h3>{event.title}</h3><p>{event.description || ''}</p><small>{[event.venue,event.ward].filter(Boolean).join(' • ')}</small><div><a className="detail-link" href={`/events/${event.id}`}>View event →</a></div></div>
          </article>)}
        </div>}
      </div>
    </section>
  </main>
}


function usableMediaUrl(value: unknown): value is string {
  return typeof value === 'string' && (value.startsWith('https://') || value.startsWith('http://') || value.startsWith('/'))
}

function GallerySlideshow({items}:{items:any[]}) {
  const pictures=items.filter(item=>usableMediaUrl(item.image_url)).slice(0,16)
  const [active,setActive]=React.useState(0)
  React.useEffect(()=>{
    if(pictures.length<2)return
    const timer=window.setInterval(()=>setActive(v=>(v+1)%pictures.length),4500)
    return()=>window.clearInterval(timer)
  },[pictures.length])
  if(!pictures.length)return null
  return <section className="media-feature-slideshow" aria-label="Featured campaign photographs">
    {pictures.map((item,index)=><figure key={`${item.source}-${item.id}-${index}`} className={index===active?'active':''}>
      <img src={item.image_url} alt={item.caption||`Campaign photograph ${index+1}`}/>
      <figcaption>{item.caption||'Campaign moment'}</figcaption>
    </figure>)}
    {pictures.length>1&&<><button className="media-slide-prev" onClick={()=>setActive(v=>(v-1+pictures.length)%pictures.length)} aria-label="Previous photo">‹</button><button className="media-slide-next" onClick={()=>setActive(v=>(v+1)%pictures.length)} aria-label="Next photo">›</button><div className="media-slide-dots">{pictures.map((_,i)=><button key={i} className={i===active?'active':''} onClick={()=>setActive(i)} aria-label={`Show photo ${i+1}`}/>)}</div></>}
  </section>
}


function AlbumViewer({
  items,
  title,
  description
}: {
  items: any[]
  title: string
  description?: string
}) {
  const [open,setOpen]=React.useState(false)
  const [active,setActive]=React.useState(0)

  React.useEffect(()=>{
    if(!open)return
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape')setOpen(false)
      if(event.key==='ArrowRight')setActive(v=>(v+1)%items.length)
      if(event.key==='ArrowLeft')setActive(v=>(v-1+items.length)%items.length)
    }
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[open,items.length])

  if(!items.length)return null
  const cover=items[0]

  return <>
    <button
      type="button"
      className="photo-album-card"
      onClick={()=>{setActive(0);setOpen(true)}}
      aria-label={`Open ${title} photo album`}
    >
      <div className="album-cover-stack">
        <span className="album-sheet sheet-back"/>
        <span className="album-sheet sheet-middle"/>
        <img src={cover.image_url} alt={cover.caption||title}/>
      </div>
      <div className="album-card-copy">
        <span className="section-kicker">PHOTO ALBUM</span>
        <h3>{title}</h3>
        {description&&<p>{description}</p>}
        <strong>{items.length} photograph{items.length===1?'':'s'} · Click to browse</strong>
      </div>
    </button>

    {open&&<div className="album-lightbox" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="album-close" onClick={()=>setOpen(false)} aria-label="Close album"><X/></button>
      <button type="button" className="album-prev" onClick={()=>setActive(v=>(v-1+items.length)%items.length)} aria-label="Previous photograph">‹</button>
      <figure>
        <img src={items[active].image_url} alt={items[active].caption||`Photograph ${active+1}`}/>
        <figcaption>
          <strong>{cleanPublicCaption(items[active].caption)}</strong>
          {items[active].description&&<span>{items[active].description}</span>}
          <small>{active+1} of {items.length}</small>
        </figcaption>
      </figure>
      <button type="button" className="album-next" onClick={()=>setActive(v=>(v+1)%items.length)} aria-label="Next photograph">›</button>
      <div className="album-filmstrip">
        {items.map((item,index)=><button type="button" key={`${item.source}-${item.id}-${index}`} className={index===active?'active':''} onClick={()=>setActive(index)} aria-label={`View photograph ${index+1}`}>
          <img src={item.image_url} alt=""/>
        </button>)}
      </div>
    </div>}
  </>
}

function MediaPage({ content }: { content: Content }) {
  const { data: media, loading } = useLiveApi<LiveMediaAsset[]>('/api/media', [])
  const { data: gallery } = useLiveApi<any[]>('/api/media-gallery', [])
  const photos=gallery.filter((item:any)=>usableMediaUrl(item.image_url))
  const resources=media.filter(item=>item.asset_type!=='photo' && usableMediaUrl(item.file_url))

  return <main className="inner-page">
    <section className="page-hero compact">
      <div className="container">
        <span className="section-kicker">Media Centre</span>
        <h1>Campaign Media</h1>
        <p>Official photographs, campaign resources and public communications from {content.candidateName}.</p>
      </div>
    </section>

    <section className="section album-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">PHOTO ALBUMS</span>
          <h2>Campaign photographs</h2>
          <p>Open the album and browse the photographs one by one using the arrows, keyboard keys, or thumbnail strip.</p>
        </div>
        {loading?<div className="public-empty">Loading campaign album…</div>:
        photos.length===0?<div className="public-empty"><ImageIcon/><h3>No gallery photographs yet</h3></div>:
        <div className="album-grid">
          <AlbumViewer
            items={photos}
            title="Campaign moments"
            description="Media Library and event photographs from campaign activities across Makueni."
          />
        </div>}
      </div>
    </section>

    {resources.length>0&&<section className="section resources-section">
      <div className="container">
        <div className="section-heading"><span className="section-kicker">RESOURCES</span><h2>Videos & documents</h2></div>
        <div className="media-resource-grid">
          {resources.map(item=><article key={item.id}>
            <FileText/>
            <div>
              <strong>{item.title||'Campaign resource'}</strong>
              {item.description&&<p>{item.description}</p>}
              <a href={item.file_url} target="_blank" rel="noreferrer">Open resource →</a>
            </div>
          </article>)}
        </div>
      </div>
    </section>}
  </main>
}
function ContactPage({ content }: { content: Content }) {
  const [state,setState] = React.useState('')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setState('sending'); const data = Object.fromEntries(new FormData(e.currentTarget)); try { await submit('contact', data); setState('sent'); e.currentTarget.reset() } catch { setState('error') } }
  return <><PageHero kicker="CONTACT THE CAMPAIGN" title="We are ready to hear from you." text="Send a question, invitation, development proposal or media request to the campaign secretariat."/><section className="section contact-section"><div className="container contact-grid"><div><div className="contact-list"><div><MapPin/><span><strong>Campaign Secretariat</strong><small>{content.office}</small></span></div><a href={`tel:${content.phone.replace(/\s+/g,'')}`}><Phone/><span><strong>Telephone</strong><small>{content.phone}</small></span></a><a href={`mailto:${content.email}`}><Mail/><span><strong>Email</strong><small>{content.email}</small></span></a></div></div><form className="contact-form" onSubmit={onSubmit}><div className="form-row"><label>Full name<input name="name" required/></label><label>Phone number<input name="phone" required/></label></div><div className="form-row"><label>Email<input name="email" type="email"/></label><label>Subject<select name="subject" required defaultValue=""><option value="" disabled>Select one</option><option>General enquiry</option><option>Media request</option><option>Event invitation</option><option>Development proposal</option><option>Partnership</option></select></label></div><label>Your message<textarea name="message" required rows={6}/></label><input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><button className="btn primary submit" disabled={state==='sending'}>{state==='sending'?'Sending…':'Send Message'} <ArrowRight size={18}/></button>{state==='sent'&&<div className="success">Thank you. Your message has been saved.</div>}{state==='error'&&<div className="form-error">Could not submit. Start the API with <strong>npm run api</strong>.</div>}</form></div></section></>
}

function VolunteerPage() {
  const [state,setState]=React.useState('')
  const onSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();setState('sending');const data=Object.fromEntries(new FormData(e.currentTarget));try{await submit('volunteer',data);setState('sent');e.currentTarget.reset()}catch{setState('error')}}
  return <><PageHero kicker="JOIN THE MOVEMENT" title="Help shape Makueni’s next chapter." text="Register for community outreach, events, policy engagement, communications or grassroots mobilisation." image="/assets/philip-kaloki-media-wide.webp"/><section className="section volunteer-section"><div className="container volunteer-grid"><div><div className="section-kicker">VOLUNTEER NETWORK</div><h2>Choose how you want to contribute.</h2><div className="volunteer-benefits"><span><CheckCircle2/> Community outreach</span><span><CheckCircle2/> Events and mobilisation</span><span><CheckCircle2/> Policy and research</span><span><CheckCircle2/> Communications</span></div></div><form className="contact-form" onSubmit={onSubmit}><div className="form-row"><label>Full name<input name="name" required/></label><label>Phone<input name="phone" required/></label></div><div className="form-row"><label>Ward<input name="ward" required/></label><label>Area of interest<select name="interest" required defaultValue=""><option value="" disabled>Select one</option><option>Community outreach</option><option>Events</option><option>Communications</option><option>Policy and research</option><option>Youth mobilisation</option><option>Women mobilisation</option></select></label></div><label>How would you like to contribute?<textarea name="message" rows={5}/></label><input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><label className="consent"><input name="consent" type="checkbox" required value="yes"/> I consent to being contacted about campaign activities.</label><button className="btn primary submit">Submit Volunteer Interest <ArrowRight size={18}/></button>{state==='sent'&&<div className="success">Your volunteer registration has been saved.</div>}{state==='error'&&<div className="form-error">Unable to save. Confirm the API server is running.</div>}</form></div></section></>
}

function NewsletterSection() {
  const [state,setState]=React.useState('')
  const onSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();setState('sending');const data=Object.fromEntries(new FormData(e.currentTarget));try{await submit('newsletter',data);setState('sent');e.currentTarget.reset()}catch{setState('error')}}
  return <section className="newsletter-band"><div className="container newsletter-inner"><div><Mail/><span><strong>Stay informed.</strong><small>Receive campaign updates, policy releases and public-event notices.</small></span></div><form onSubmit={onSubmit}><input name="email" type="email" required placeholder="Email address" aria-label="Email address"/><input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><button disabled={state==='sending'}>{state==='sending'?'Subscribing…':'Subscribe'}</button></form>{state==='sent'&&<small className="newsletter-status">Subscription saved.</small>}{state==='error'&&<small className="newsletter-status">Unable to subscribe right now.</small>}</div></section>
}

function LegalPage({ type }: { type: 'privacy'|'terms'|'accessibility' }) {
  const content = {
    privacy: { kicker:'PRIVACY', title:'Privacy & data notice', intro:'This website collects only information that visitors choose to submit through contact, volunteer and newsletter forms.', blocks:[['Information collected','Contact details, ward or area information, messages, volunteer interests and newsletter email addresses may be stored when submitted.'],['How information is used','Submitted information is intended for campaign communication, volunteer coordination, event follow-up and responding to enquiries.'],['Data choices','Visitors may request correction or deletion of information by contacting the campaign secretariat. Production deployment should use the approved campaign privacy policy and a persistent secured database.']] },
    terms: { kicker:'WEBSITE TERMS', title:'Terms of use', intro:'These terms provide a practical framework for use of the campaign website while final legal wording is approved.', blocks:[['Website information','Campaign information may be updated as policies, events and official statements are approved.'],['Acceptable use','Visitors should not attempt to disrupt the website, misuse forms, impersonate other people or submit unlawful content.'],['Official material','Only content published through approved campaign channels should be treated as an official campaign statement.']] },
    accessibility: { kicker:'ACCESSIBILITY', title:'Accessibility commitment', intro:'The website is designed to remain usable across phones, tablets and desktops and to support keyboard and assistive-technology navigation.', blocks:[['Navigation','A skip link, semantic headings, keyboard-accessible controls and visible focus states are included.'],['Images and contrast','Campaign images include alternative text where meaningful and the interface uses high-contrast text and controls.'],['Feedback','If any part of the website is difficult to access, contact the campaign secretariat so the issue can be reviewed.']] }
  }[type]
  return <><PageHero kicker={content.kicker} title={content.title} text={content.intro}/><section className="section legal-section"><div className="container legal-copy">{content.blocks.map(([h,p])=><article key={h}><h2>{h}</h2><p>{p}</p></article>)}<div className="legal-note"><ShieldCheck/><p>Before the public launch, these draft notices should be reviewed and replaced with formally approved campaign legal text where required.</p></div></div></section></>
}

function NotFoundPage() { return <section className="not-found"><div><span>404</span><h1>Page not found.</h1><p>The page may have moved or the address may be incorrect.</p><a className="btn primary" href="/">Return home</a></div></section> }

function updateSeo(path: string, content: Content) {
  const meta: Record<string,[string,string]> = {
    '/':['Prof. Philip Kaloki | Makueni County 2027', content.heroText],
    '/about':['About Prof. Philip Kaloki | Makueni County 2027', content.biography],
    '/agenda':['2027 Development Agenda | Prof. Philip Kaloki','Explore the campaign development agenda for Makueni County.'],
    '/news':['News & Updates | Prof. Philip Kaloki','Official campaign updates, engagements and announcements.'],
    '/media':['Media Centre | Prof. Philip Kaloki','Press resources, campaign photography and media contacts.'],
    '/contact':['Contact the Campaign | Prof. Philip Kaloki','Contact the campaign secretariat for enquiries, invitations and media requests.'],
    '/volunteer':['Volunteer | Prof. Philip Kaloki','Register your interest in supporting community outreach and campaign activities.'],
    '/privacy':['Privacy Notice | Prof. Philip Kaloki','Privacy and data-use information for campaign website visitors.'],
    '/terms':['Website Terms | Prof. Philip Kaloki','Terms governing use of the campaign website.'],
    '/accessibility':['Accessibility | Prof. Philip Kaloki','Accessibility information for the campaign website.']
  }
  const [title,description]=meta[path]||['Prof. Philip Kaloki | Makueni County 2027',content.heroText]
  document.title=title
  let node=document.querySelector('meta[name="description"]') as HTMLMetaElement|null
  if(!node){node=document.createElement('meta');node.name='description';document.head.appendChild(node)}
  node.content=description
  const canonical=document.querySelector('link[rel="canonical"]') as HTMLLinkElement|null
  if(canonical) canonical.href=window.location.origin+path
}

type AdminTab = 'dashboard'|'inbox'|'content'|'news'|'events'|'media'|'images'|'social'|'audit'
type CmsRow = Record<string, any> & { id: string }


async function uploadAdminFile(file: File, key: string): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'x-admin-key': key },
    body
  })
  const detail = await response.json().catch(() => ({}))
  if (!response.ok || !detail.url) {
    throw new Error(detail.error || 'Upload failed')
  }
  return String(detail.url)
}


function AdminUploadField({
  name,
  label,
  defaultValue,
  adminKey,
  accept = 'image/*',
  required = false
}: {
  name: string
  label: string
  defaultValue?: string
  adminKey: string
  accept?: string
  required?: boolean
}) {
  const [url, setUrl] = React.useState(defaultValue || '')
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    setUrl(defaultValue || '')
  }, [defaultValue])

  const choose = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const url = await uploadAdminFile(file, adminKey)
      setUrl(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <label className="cms-upload-field">
      {label}
      <input
        name={name}
        value={url}
        required={required}
        onChange={e => setUrl(e.target.value)}
        placeholder="Upload a file or paste an image URL"
      />
      <div className="cms-upload-box">
        <input type="file" accept={accept} onChange={choose} />
        <span>{uploading ? 'Uploading to Supabase…' : 'Choose file from computer'}</span>
      </div>
      {url && accept.startsWith('image/') && (
        <img className="cms-upload-preview" src={url} alt="" />
      )}
      {error && <small className="cms-upload-error">{error}</small>}
    </label>
  )
}

function SiteImagesManager({ content, setContent, adminKey }: { content: Content; setContent: React.Dispatch<React.SetStateAction<Content>>; adminKey: string }) {
  const [slides,setSlides]=React.useState<HomeSlide[]>([])
  const [message,setMessage]=React.useState('')
  const [busy,setBusy]=React.useState(false)
  const [pendingFiles,setPendingFiles]=React.useState<File[]>([])
  const [bulkCaption,setBulkCaption]=React.useState('')
  const [bulkDescription,setBulkDescription]=React.useState('')
  const [selected,setSelected]=React.useState<Set<string>>(new Set())

  const headers={'x-admin-key':adminKey,'Content-Type':'application/json'}
  const load=async()=>{
    const r=await fetch('/api/admin/slides',{headers:{'x-admin-key':adminKey}})
    if(r.ok)setSlides(await r.json())
  }
  React.useEffect(()=>{load()},[])

  const chooseBulk=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setPendingFiles(Array.from(e.target.files||[]))
    setMessage('')
  }

  const publishBulk=async()=>{
    if(!pendingFiles.length)return
    if(!window.confirm(`Add ${pendingFiles.length} selected image${pendingFiles.length===1?'':'s'} to the homepage slideshow?`))return
    setBusy(true)
    let added=0
    for(let i=0;i<pendingFiles.length;i++){
      try{
        const url=await uploadAdminFile(pendingFiles[i],adminKey)
        const caption=bulkCaption.trim()
          ? (pendingFiles.length===1?bulkCaption.trim():`${bulkCaption.trim()} ${i+1}`)
          : `Slideshow image ${slides.length+i+1}`
        const r=await fetch('/api/admin/slides',{
          method:'POST',
          headers,
          body:JSON.stringify({
            image_url:url,
            alt_text:caption,
            description:bulkDescription.trim(),
            is_active:true,
            sort_order:slides.length+i
          })
        })
        if(r.ok)added++
      }catch{}
    }
    setPendingFiles([])
    setBulkCaption('')
    setBulkDescription('')
    await load()
    setMessage(`${added} slideshow image${added===1?'':'s'} added.`)
    setBusy(false)
  }

  const add=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setBusy(true)
    const data=Object.fromEntries(new FormData(e.currentTarget))
    const r=await fetch('/api/admin/slides',{
      method:'POST',
      headers,
      body:JSON.stringify({...data,is_active:true,sort_order:slides.length})
    })
    if(r.ok){
      e.currentTarget.reset()
      await load()
      setMessage('Slideshow image added.')
    }else setMessage('Could not add slideshow image.')
    setBusy(false)
  }

  const remove=async(id:string)=>{
    if(!confirm('Remove this slideshow image?'))return
    await fetch(`/api/admin/slides/${id}`,{method:'DELETE',headers:{'x-admin-key':adminKey}})
    await load()
  }

  const toggle=async(slide:HomeSlide)=>{
    await fetch(`/api/admin/slides/${slide.id}`,{
      method:'PUT',
      headers,
      body:JSON.stringify({...slide,is_active:!slide.is_active})
    })
    await load()
  }

  const move=async(index:number,direction:-1|1)=>{
    const target=index+direction
    if(target<0||target>=slides.length)return
    const ordered=[...slides]
    ;[ordered[index],ordered[target]]=[ordered[target],ordered[index]]
    const r=await fetch('/api/admin/slides/reorder',{
      method:'POST',
      headers,
      body:JSON.stringify({ids:ordered.map(s=>s.id)})
    })
    if(r.ok)await load()
  }

  const toggleSelected=(id:string)=>{
    setSelected(prev=>{
      const next=new Set(prev)
      next.has(id)?next.delete(id):next.add(id)
      return next
    })
  }

  const selectAll=()=>{
    setSelected(selected.size===slides.length?new Set():new Set(slides.map(x=>x.id)))
  }

  const deleteSelected=async()=>{
    if(!selected.size)return
    if(!window.confirm(`Delete ${selected.size} selected slideshow image${selected.size===1?'':'s'}?`))return
    setBusy(true)
    for(const id of selected){
      await fetch(`/api/admin/slides/${id}`,{method:'DELETE',headers:{'x-admin-key':adminKey}})
    }
    setSelected(new Set())
    await load()
    setMessage('Selected slideshow images deleted.')
    setBusy(false)
  }

  const saveCovers=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setBusy(true)
    const data=Object.fromEntries(new FormData(e.currentTarget))
    const r=await fetch('/api/admin/content',{method:'PUT',headers,body:JSON.stringify(data)})
    if(r.ok){
      const next=await r.json()
      setContent(prev=>({...fallbackContent,...prev,...next}))
      setMessage('Cover and candidate images updated.')
    }else setMessage('Could not save cover images.')
    setBusy(false)
  }

  return <div className="phase25-image-manager">
    <section className="site-images-manager">
      <div className="cms-create-title"><ImageIcon/><div>
        <h2>Automatic homepage slideshow</h2>
        <p>Select several images, add context, preview the batch, then confirm once before publishing.</p>
      </div></div>

      <div className="slideshow-bulk-fields">
        <label>Shared caption / title
          <input value={bulkCaption} onChange={e=>setBulkCaption(e.target.value)} placeholder="e.g. Listening to residents across Makueni"/>
        </label>
        <label>Brief description / context
          <textarea rows={3} value={bulkDescription} onChange={e=>setBulkDescription(e.target.value)} placeholder="What is happening in this group of photographs?"/>
        </label>
        <label className="multi-upload-panel">Choose multiple slideshow images
          <input type="file" accept="image/*" multiple onChange={chooseBulk} disabled={busy}/>
        </label>
      </div>

      {pendingFiles.length>0&&<>
        <div className="selected-upload-preview">
          {pendingFiles.map((file,index)=><div key={`${file.name}-${index}`}><span>{index+1}</span><strong>{file.name}</strong></div>)}
        </div>
        <div className="batch-actions">
          <button type="button" className="btn primary" disabled={busy} onClick={publishBulk}><Plus/> {busy?'Uploading…':`Add ${pendingFiles.length} selected`}</button>
          <button type="button" className="cms-cancel" disabled={busy} onClick={()=>setPendingFiles([])}>Cancel</button>
        </div>
      </>}

      <details className="single-media-details">
        <summary>Or add one slideshow image by URL</summary>
        <form onSubmit={add}>
          <AdminUploadField name="image_url" label="Image" adminKey={adminKey} required/>
          <label>Caption / alt text<input name="alt_text" placeholder="e.g. Meeting farmers in Makueni"/></label>
          <label>Brief description<textarea name="description" rows={3} placeholder="Optional context shown with the image"/></label>
          <button type="submit" className="btn primary" disabled={busy}><Plus/> Add Image</button>
        </form>
      </details>
    </section>

    <section className="slides-admin-list compact">
      <div className="cms-records-head">
        <div><h2>Slideshow images</h2><span>{slides.length} images</span></div>
        {slides.length>0&&<div className="bulk-actions">
          <button type="button" onClick={selectAll}>{selected.size===slides.length?'Clear selection':'Select all'}</button>
          <button type="button" className="bulk-delete" disabled={!selected.size||busy} onClick={deleteSelected}><Trash2/> Delete selected ({selected.size})</button>
        </div>}
      </div>

      {slides.length===0?<div className="empty-state"><ImageIcon/><h3>No database slides yet</h3></div>:
      <div className="slides-admin-grid">
        {slides.map((slide,index)=><article key={slide.id} className={selected.has(slide.id)?'selected':''}>
          <label className="slide-select"><input type="checkbox" checked={selected.has(slide.id)} onChange={()=>toggleSelected(slide.id)}/></label>
          <img src={slide.image_url} alt=""/>
          <div className="slide-card-copy">
            <strong>{cleanPublicCaption(slide.alt_text||`Slideshow image ${index+1}`)}</strong>
            {slide.description&&<p>{slide.description}</p>}
            <span>{slide.is_active?'Active':'Hidden'}</span>
          </div>
          <div className="slide-admin-actions">
            <button type="button" onClick={()=>move(index,-1)} disabled={index===0} aria-label="Move earlier"><ArrowUp/></button>
            <button type="button" onClick={()=>move(index,1)} disabled={index===slides.length-1} aria-label="Move later"><ArrowDown/></button>
            <button type="button" onClick={()=>toggle(slide)}>{slide.is_active?'Hide':'Show'}</button>
            <button type="button" className="danger-icon" onClick={()=>remove(slide.id)}><Trash2/></button>
          </div>
        </article>)}
      </div>}
    </section>

    <form className="site-images-manager cover-manager" onSubmit={saveCovers}>
      <div className="cms-create-title"><ImageIcon/><div><h2>Cover & candidate identity images</h2><p>Change the About page cover and the portrait shown on News/Event pages.</p></div></div>
      <div className="site-image-grid">
        <AdminUploadField name="aboutImage" label="About / cover image" defaultValue={content.aboutImage} adminKey={adminKey}/>
        <AdminUploadField name="candidateCardImage" label="News & event candidate portrait" defaultValue={content.candidateCardImage} adminKey={adminKey}/>
      </div>
      <button type="submit" className="btn primary" disabled={busy}><Save/> Save Image Changes</button>
    </form>
    {message&&<div className="admin-message">{message}</div>}
  </div>
}

function SocialMediaManager({ content, setContent, adminKey }: { content: Content; setContent: React.Dispatch<React.SetStateAction<Content>>; adminKey: string }) {
  const [message,setMessage]=React.useState('')
  const save=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json','x-admin-key':adminKey},body:JSON.stringify(data)});if(r.ok){const next=await r.json();setContent(prev=>({...fallbackContent,...prev,...next}));setMessage('Social media handles updated.')}else setMessage('Could not save social handles.')}
  return <form className="social-admin-manager" onSubmit={save}><div className="cms-create-title"><Share2/><div><h2>Social media handles</h2><p>These links appear beside the leadership message and in the website footer.</p></div></div><div className="social-admin-grid"><label><FacebookIcon/> Facebook<input name="facebook" defaultValue={content.facebook||''} placeholder="https://facebook.com/..."/></label><label><X/> X (Twitter)<input name="twitter" defaultValue={content.twitter||''} placeholder="https://x.com/..."/></label><label><Instagram/> Instagram<input name="instagram" defaultValue={content.instagram||''} placeholder="https://instagram.com/..."/></label><label><Music2/> TikTok<input name="tiktok" defaultValue={content.tiktok||''} placeholder="https://tiktok.com/@..."/></label><label><Youtube/> YouTube<input name="youtube" defaultValue={content.youtube||''} placeholder="https://youtube.com/@..."/></label></div><button className="btn primary"><Save/> Save Social Handles</button>{message&&<div className="admin-message">{message}</div>}</form>
}

function AdminPage({ content, setContent }: { content: Content; setContent: React.Dispatch<React.SetStateAction<Content>> }) {
  const [key,setKey]=React.useState(sessionStorage.getItem('pk-admin-key')||'')
  const [logged,setLogged]=React.useState(false)
  const [tab,setTab]=React.useState<AdminTab>('dashboard')
  const [rows,setRows]=React.useState<Submission[]>([])
  const [cmsRows,setCmsRows]=React.useState<CmsRow[]>([])
  const [stats,setStats]=React.useState<Record<string,number>>({})
  const [message,setMessage]=React.useState('')
  const [busy,setBusy]=React.useState(false)
  const headers=(extra:Record<string,string>={})=>({'x-admin-key':key,...extra})

  const loadDashboard=async()=>{const r=await fetch('/api/admin/dashboard',{headers:headers()});if(!r.ok)throw new Error();setStats(await r.json())}
  const loadSubmissions=async()=>{const r=await fetch('/api/admin/submissions',{headers:headers()});if(!r.ok)throw new Error();setRows(await r.json())}
  const loadCms=async(kind:'news'|'events'|'media'|'audit')=>{const r=await fetch(`/api/admin/${kind}`,{headers:headers()});if(!r.ok)throw new Error();setCmsRows(await r.json())}
  const authenticate=async(k=key)=>{const r=await fetch('/api/admin/dashboard',{headers:{'x-admin-key':k}});if(!r.ok)throw new Error();setStats(await r.json());setLogged(true);sessionStorage.setItem('pk-admin-key',k)}
  const login=async(e:React.FormEvent)=>{e.preventDefault();try{await authenticate();setMessage('')}catch{setMessage('Invalid admin key or API is unavailable.')}}
  const changeTab=async(next:AdminTab)=>{setTab(next);setMessage('');try{if(next==='dashboard')await loadDashboard();if(next==='inbox')await loadSubmissions();if(['news','events','media','audit'].includes(next))await loadCms(next as 'news'|'events'|'media'|'audit')}catch{setMessage('Could not load this section.')}}
  const saveContent=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();setBusy(true);const data=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/admin/content',{method:'PUT',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify(data)});if(r.ok){const next=await r.json();setContent(prev=>({...fallbackContent,...prev,...next}));setMessage('Official website content saved to Supabase.')}else setMessage('Save failed.');setBusy(false)}
  const changeStatus=async(row:Submission,status:string)=>{const r=await fetch(`/api/admin/submissions/${row.type}/${row.id}`,{method:'PATCH',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify({status})});if(r.ok){await loadSubmissions();setMessage(`Submission marked ${status}.`)}}
  const saveCms=async(kind:'news'|'events'|'media',e:React.FormEvent<HTMLFormElement>,id?:string)=>{e.preventDefault();setBusy(true);const data=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch(id?`/api/admin/${kind}/${id}`:`/api/admin/${kind}`,{method:id?'PUT':'POST',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify(data)});if(r.ok){e.currentTarget.reset();await loadCms(kind);await loadDashboard();setMessage(`${kind} item ${id?'updated':'created'}.`)}else setMessage(`Could not save ${kind} item.`);setBusy(false)}
  const deleteCms=async(kind:'news'|'events'|'media',id:string)=>{if(!confirm('Delete this item permanently?'))return;const r=await fetch(`/api/admin/${kind}/${id}`,{method:'DELETE',headers:headers()});if(r.ok){await loadCms(kind);await loadDashboard();setMessage('Item deleted.')}}

  if(!logged) return <section className="admin-shell"><div className="admin-login"><LockKeyhole/><h1>Campaign Admin</h1><p>Secure content management for the Philip Kaloki campaign website.</p><form onSubmit={login}><input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Admin key"/><button className="btn primary">Sign in</button></form>{message&&<div className="form-error">{message}</div>}<a href="/">← Back to website</a></div></section>

  const title={dashboard:'Command Dashboard',inbox:'Submission Inbox',content:'Official Website Content',news:'Newsroom Manager',events:'Events Manager',media:'Media Library',images:'Homepage Images',social:'Social Media',audit:'Audit Trail'}[tab]
  const statCards=[['Contacts',stats.contact_submissions||0,<Mail/>],['Volunteers',stats.volunteer_submissions||0,<Users/>],['Citizen ideas',stats.citizen_ideas||0,<MessageCircle/>],['Subscribers',stats.newsletter_subscribers||0,<Inbox/>],['News posts',stats.news_posts||0,<Newspaper/>],['Events',stats.events||0,<Calendar/>],['Media',stats.media_assets||0,<ImageIcon/>]]
  return <section className="admin-shell cms-v17"><aside className="admin-sidebar"><div className="brand"><span className="brand-mark">PK</span><span><strong>CAMPAIGN CMS</strong><small>SUPABASE • PHASE 26</small></span></div>
    <button className={tab==='dashboard'?'active':''} onClick={()=>changeTab('dashboard')}><LayoutDashboard/> Dashboard</button>
    <button className={tab==='inbox'?'active':''} onClick={()=>changeTab('inbox')}><Inbox/> Submissions</button>
    <button className={tab==='content'?'active':''} onClick={()=>changeTab('content')}><Settings/> Website content</button>
    <button className={tab==='news'?'active':''} onClick={()=>changeTab('news')}><Newspaper/> News</button>
    <button className={tab==='events'?'active':''} onClick={()=>changeTab('events')}><Calendar/> Events</button>
    <button className={tab==='media'?'active':''} onClick={()=>changeTab('media')}><ImageIcon/> Media</button>
    <button className={tab==='images'?'active':''} onClick={()=>changeTab('images')}><ImageIcon/> Homepage images</button>
    <button className={tab==='social'?'active':''} onClick={()=>changeTab('social')}><Share2/> Social media</button>
    <button className={tab==='audit'?'active':''} onClick={()=>changeTab('audit')}><Activity/> Audit log</button>
    <a href="/"><Eye/> View website</a><button onClick={()=>{sessionStorage.removeItem('pk-admin-key');location.reload()}}><LogOut/> Sign out</button></aside>
    <div className="admin-main"><div className="admin-top"><div><span>CAMPAIGN SECRETARIAT</span><h1>{title}</h1></div><button className="admin-refresh" onClick={()=>changeTab(tab)}><RefreshCw/> Refresh</button></div>{message&&<div className="admin-message">{message}</div>}
    {tab==='dashboard'&&<><div className="cms-stat-grid">{statCards.map(([label,value,icon])=><article key={String(label)}><span>{icon as React.ReactNode}</span><strong>{String(value)}</strong><small>{String(label)}</small></article>)}</div><div className="cms-welcome"><Database/><div><h2>Supabase CMS connected</h2><p>Website content, enquiries, volunteer records, news, events, media records and audit activity are managed from one production database.</p></div></div></>}
    {tab==='inbox'&&<div className="submission-list">{rows.length===0?<div className="empty-state"><Inbox/><h3>No submissions yet</h3><p>Website submissions will appear here.</p></div>:rows.map(r=><article key={r.id}><div className="submission-head"><span className={`status ${r.status}`}>{r.status==='new'?<Clock3/>:<Check/>}{r.status}</span><strong>{(r.type||'submission').toUpperCase()}</strong><small>{new Date(r.createdAt).toLocaleString()}</small></div><h3>{r.name||r.email||'Website submission'}</h3><p>{r.message||r.subject||r.interest||'Newsletter subscription'}</p><div className="submission-meta">{Object.entries(r).filter(([k])=>!['id','type','createdAt','status','message'].includes(k)).slice(0,7).map(([k,v])=><span key={k}><b>{k}:</b> {String(v||'—')}</span>)}</div><div className="cms-actions"><button onClick={()=>changeStatus(r,'reviewed')}>Reviewed</button><button onClick={()=>changeStatus(r,'closed')}>Close</button></div></article>)}</div>}
    {tab==='content'&&<form className="admin-content-form cms-content" onSubmit={saveContent}>{Object.entries(content).map(([k,v])=><label key={k}>{k}<textarea name={k} defaultValue={v||''} rows={k==='biography'||k==='heroText'?4:2}/></label>)}<button disabled={busy} className="btn primary"><Save/> {busy?'Saving…':'Save Official Content'}</button></form>}
    {tab==='news'&&<CmsManager kind="news" rows={cmsRows} busy={busy} onSave={saveCms} onDelete={deleteCms} adminKey={key}/>}
    {tab==='events'&&<CmsManager kind="events" rows={cmsRows} busy={busy} onSave={saveCms} onDelete={deleteCms} adminKey={key}/>}
    {tab==='media'&&<CmsManager kind="media" rows={cmsRows} busy={busy} onSave={saveCms} onDelete={deleteCms} adminKey={key}/>}
    {tab==='images'&&<SiteImagesManager content={content} setContent={setContent} adminKey={key}/>}
    {tab==='social'&&<SocialMediaManager content={content} setContent={setContent} adminKey={key}/>}
    {tab==='audit'&&<div className="audit-list">{cmsRows.map(r=><article key={r.id}><Activity/><div><strong>{String(r.action||'Activity')}</strong><span>{String(r.entity_type||'system')} {r.entity_id?`• ${r.entity_id}`:''}</span><small>{r.created_at?new Date(r.created_at).toLocaleString():''}</small></div></article>)}</div>}
    </div></section>
}

function NewsGalleryAdmin({newsId,adminKey}:{newsId:string;adminKey:string}) {
  const [images,setImages]=React.useState<NewsImage[]>([])
  const [busy,setBusy]=React.useState(false)
  const [message,setMessage]=React.useState('')
  const [caption,setCaption]=React.useState('')

  const load=async()=>{
    const r=await fetch(`/api/admin/news/${newsId}/images`,{headers:{'x-admin-key':adminKey}})
    if(r.ok)setImages(await r.json())
  }
  React.useEffect(()=>{load()},[newsId])

  const upload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(e.target.files||[])
    if(!files.length)return
    if(!window.confirm(`Add ${files.length} selected photo${files.length===1?'':'s'} to this news gallery?`)){e.target.value='';return}
    setBusy(true)
    const body=new FormData()
    files.forEach(file=>body.append('files',file))
    body.append('caption',caption.trim())
    const r=await fetch(`/api/admin/news/${newsId}/images`,{
      method:'POST',
      headers:{'x-admin-key':adminKey},
      body
    })
    if(r.ok){
      await load()
      setCaption('')
      setMessage(`${files.length} news photo${files.length===1?'':'s'} uploaded.`)
    }else setMessage('News gallery upload failed.')
    setBusy(false)
    e.target.value=''
  }

  const remove=async(id:string)=>{
    await fetch(`/api/admin/news-images/${id}`,{method:'DELETE',headers:{'x-admin-key':adminKey}})
    await load()
  }

  const reorder=async(index:number,direction:-1|1)=>{
    const target=index+direction
    if(target<0||target>=images.length)return
    const ordered=[...images]
    ;[ordered[index],ordered[target]]=[ordered[target],ordered[index]]
    const r=await fetch(`/api/admin/news/${newsId}/images/reorder`,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-admin-key':adminKey},
      body:JSON.stringify({ids:ordered.map(i=>i.id)})
    })
    if(r.ok)await load()
  }

  return <section className="event-gallery-admin">
    <div className="cms-create-title"><ImageIcon/><div><h3>News photo gallery</h3><p>Add multiple photographs related to this story.</p></div></div>
    <label>Shared gallery caption<input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Optional context for these photographs"/></label>
    <label>Shared gallery caption<input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Optional context for these photographs"/></label><div className="event-gallery-upload"><input type="file" accept="image/*" multiple onChange={upload} disabled={busy}/><span>{busy?'Uploading…':'Select multiple photographs'}</span></div>
    {message&&<small>{message}</small>}
    <div className="event-gallery-admin-grid">{images.map((img,index)=><article key={img.id}><img src={img.image_url} alt=""/><div><button type="button" onClick={()=>reorder(index,-1)} disabled={index===0}><ArrowUp/></button><button type="button" onClick={()=>reorder(index,1)} disabled={index===images.length-1}><ArrowDown/></button><button type="button" className="danger-icon" onClick={()=>remove(img.id)}><Trash2/></button></div></article>)}</div>
  </section>
}

function EventGalleryAdmin({ eventId, adminKey }: { eventId: string; adminKey: string }) {
  const [images,setImages]=React.useState<EventImage[]>([])
  const [busy,setBusy]=React.useState(false)
  const [message,setMessage]=React.useState('')
  const [caption,setCaption]=React.useState('')
  const load=async()=>{const r=await fetch(`/api/admin/events/${eventId}/images`,{headers:{'x-admin-key':adminKey}});if(r.ok)setImages(await r.json())}
  React.useEffect(()=>{load()},[eventId])
  const upload=async(e:React.ChangeEvent<HTMLInputElement>)=>{const files=Array.from(e.target.files||[]);if(!files.length)return;if(!window.confirm(`Add ${files.length} selected photo${files.length===1?'':'s'} to this event gallery?`)){e.target.value='';return}setBusy(true);const body=new FormData();files.forEach(file=>body.append('files',file));body.append('caption',caption.trim());const r=await fetch(`/api/admin/events/${eventId}/images`,{method:'POST',headers:{'x-admin-key':adminKey},body});if(r.ok){await load();setMessage(`${files.length} event photo${files.length===1?'':'s'} uploaded.`)}else setMessage('Event gallery upload failed.');setBusy(false);e.target.value=''}
  const remove=async(id:string)=>{await fetch(`/api/admin/event-images/${id}`,{method:'DELETE',headers:{'x-admin-key':adminKey}});await load()}
  const reorder=async(index:number,direction:-1|1)=>{const target=index+direction;if(target<0||target>=images.length)return;const ordered=[...images];[ordered[index],ordered[target]]=[ordered[target],ordered[index]];const r=await fetch(`/api/admin/events/${eventId}/images/reorder`,{method:'POST',headers:{'Content-Type':'application/json','x-admin-key':adminKey},body:JSON.stringify({ids:ordered.map(i=>i.id)})});if(r.ok)await load()}
  return <section className="event-gallery-admin"><div className="cms-create-title"><ImageIcon/><div><h3>Event mini gallery</h3><p>Upload unlimited event photographs in batches. Visitors see them on this event's public page.</p></div></div><div className="event-gallery-upload"><input type="file" accept="image/*" multiple onChange={upload} disabled={busy}/><span>{busy?'Uploading…':'Select multiple photographs'}</span></div>{message&&<small>{message}</small>}<div className="event-gallery-admin-grid">{images.map((img,index)=><article key={img.id}><img src={img.image_url} alt=""/><div><button type="button" onClick={()=>reorder(index,-1)} disabled={index===0}><ArrowUp/></button><button type="button" onClick={()=>reorder(index,1)} disabled={index===images.length-1}><ArrowDown/></button><button type="button" className="danger-icon" onClick={()=>remove(img.id)}><Trash2/></button></div></article>)}</div></section>
}


function MediaBatchUploader({adminKey,onDone}:{adminKey:string;onDone?:()=>void}) {
  const [files,setFiles]=React.useState<File[]>([])
  const [title,setTitle]=React.useState('')
  const [description,setDescription]=React.useState('')
  const [busy,setBusy]=React.useState(false)
  const [message,setMessage]=React.useState('')

  const clear=()=>{setFiles([]);setMessage('')}

  const publish=async()=>{
    if(!files.length)return
    if(!window.confirm(`Publish ${files.length} selected photo${files.length===1?'':'s'} to the public media gallery?`))return
    setBusy(true)
    let ok=0
    const base=title.trim()||'Campaign photograph'
    for(let i=0;i<files.length;i++){
      try{
        const url=await uploadAdminFile(files[i],adminKey)
        const itemTitle=files.length===1?base:`${base} ${i+1}`
        const r=await fetch('/api/admin/media',{
          method:'POST',
          headers:{'Content-Type':'application/json','x-admin-key':adminKey},
          body:JSON.stringify({
            title:itemTitle,
            asset_type:'photo',
            file_url:url,
            thumbnail_url:url,
            description:description.trim(),
            published:true
          })
        })
        if(r.ok)ok++
      }catch{}
    }
    setMessage(`${ok} of ${files.length} photographs published.`)
    setFiles([])
    setTitle('')
    setDescription('')
    setBusy(false)
    onDone?.()
  }

  return <section className="media-batch-uploader staged">
    <div><strong>Bulk photo upload</strong><p>Add a title and short description, select several photographs, then confirm once.</p></div>
    <label>Gallery title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Community meeting in Wote"/></label>
    <label>Brief description<textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short context explaining this group of photographs"/></label>
    <label className="multi-upload-panel">Choose multiple photographs<input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} disabled={busy}/></label>
    {files.length>0&&<>
      <div className="selected-file-preview">{files.slice(0,20).map((file,i)=><div key={`${file.name}-${i}`}><img src={URL.createObjectURL(file)} alt=""/><span>{file.name}</span></div>)}</div>
      <div className="batch-actions">
        <button type="button" className="btn primary" onClick={publish} disabled={busy}>{busy?'Uploading…':`Publish ${files.length} selected`}</button>
        <button type="button" className="cms-cancel" onClick={clear} disabled={busy}>Cancel</button>
      </div>
    </>}
    {message&&<small>{message}</small>}
  </section>
}

function CmsManager({
  kind,
  rows,
  busy,
  onSave,
  onDelete,
  adminKey
}: {
  kind: 'news'|'events'|'media'
  rows: CmsRow[]
  busy: boolean
  onSave: (
    kind: 'news'|'events'|'media',
    e: React.FormEvent<HTMLFormElement>,
    id?: string
  ) => void
  onDelete: (kind: 'news'|'events'|'media', id: string) => void
  adminKey: string
}) {
  const [bulkMediaTitle, setBulkMediaTitle] = React.useState('')
  const [bulkMediaDescription, setBulkMediaDescription] = React.useState('')
  const [bulkMediaFiles, setBulkMediaFiles] = React.useState<File[]>([])
  const [bulkDeleting, setBulkDeleting] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const toggleSelected = (id:string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(rows.map(r => String(r.id))))
    }
  }

  const deleteSelected = async () => {
    if (!selectedIds.size) return
    if (!window.confirm(`Delete ${selectedIds.size} selected item${selectedIds.size===1?'':'s'} permanently?`)) return
    setBulkDeleting(true)
    const response=await fetch(`/api/admin/${kind}/bulk-delete`,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-admin-key':adminKey},
      body:JSON.stringify({ids:Array.from(selectedIds)})
    })
    if(response.ok){
      setSelectedIds(new Set())
      window.location.reload()
    }
    setBulkDeleting(false)
  }

  const [editing, setEditing] = React.useState<CmsRow|null>(null)

  React.useEffect(() => setEditing(null), [kind])

  return (
    <div className="cms-manager">
      {kind==='media'&&<MediaBatchUploader adminKey={adminKey}/>}
      <form
        key={editing?.id || `new-${kind}`}
        className="cms-create"
        onSubmit={e => {
          onSave(kind, e, editing?.id)
          setEditing(null)
        }}
      >
        <div className="cms-create-title">
          <Plus/>
          <div>
            <h2>
              {editing ? 'Edit' : 'Create'}{' '}
              {kind === 'news'
                ? 'news post'
                : kind === 'events'
                ? 'event'
                : 'media item'}
            </h2>
            <p>Saved directly to Supabase.</p>
          </div>
        </div>

        {kind === 'news' && (
          <>
            <label>
              Title
              <input name="title" required defaultValue={editing?.title || ''}/>
            </label>
            <label>
              Slug
              <input
                name="slug"
                placeholder="e.g. makueni-community-listening"
                defaultValue={editing?.slug || ''}
              />
            </label>
            <label>
              Category
              <input
                name="category"
                placeholder="Campaign Update"
                defaultValue={editing?.category || ''}
              />
            </label>
            <label>
              Summary
              <textarea name="summary" rows={3} defaultValue={editing?.summary || ''}/>
            </label>
            <label>
              Full article
              <textarea name="body" rows={7} defaultValue={editing?.body || ''}/>
            </label>
            <AdminUploadField
              name="image_url"
              label="Article cover image"
              defaultValue={String(editing?.image_url || '')}
              adminKey={adminKey}
            />
            <label className="cms-check">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={editing ? Boolean(editing.published) : true}
              />
              Publish this article
            </label>
            <input
              type="hidden"
              name="published_at"
              value={String(editing?.published_at || new Date().toISOString())}
            />
          </>
        )}

        {kind === 'events' && (
          <>
            <label>
              Event title
              <input name="title" required defaultValue={editing?.title || ''}/>
            </label>
            <label>
              Venue
              <input name="venue" defaultValue={editing?.venue || ''}/>
            </label>
            <label>
              Ward
              <input name="ward" defaultValue={editing?.ward || ''}/>
            </label>
            <label>
              Date and time
              <input
                name="event_date"
                type="datetime-local"
                defaultValue={
                  editing?.event_date
                    ? String(editing.event_date).slice(0,16)
                    : ''
                }
              />
            </label>
            <label>
              Description
              <textarea name="description" rows={5} defaultValue={editing?.description || ''}/>
            </label>
            <AdminUploadField
              name="image_url"
              label="Event cover image"
              defaultValue={String(editing?.image_url || '')}
              adminKey={adminKey}
            />
            <label className="cms-check">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={editing ? Boolean(editing.published) : true}
              />
              Publish this event
            </label>
          </>
        )}

        {kind === 'media' && (
          <details className="single-media-details"><summary>Add one video, document, or image by URL (optional)</summary><div className="single-media-fields">
            {!editing && <MediaBatchUploader adminKey={adminKey}/>}
            <label>
              Title
              <input name="title" required defaultValue={editing?.title || ''}/>
            </label>
            <label>
              Type
              <select name="asset_type" defaultValue={editing?.asset_type || 'photo'}>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
            </label>
            <AdminUploadField
              name="file_url"
              label="Media file"
              defaultValue={String(editing?.file_url || '')}
              adminKey={adminKey}
              accept="image/*,application/pdf"
              required
            />
            <AdminUploadField
              name="thumbnail_url"
              label="Thumbnail / preview image"
              defaultValue={String(editing?.thumbnail_url || '')}
              adminKey={adminKey}
            />
            <label>
              Description
              <textarea name="description" rows={5} defaultValue={editing?.description || ''}/>
            </label>
            <label className="cms-check">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={editing ? Boolean(editing.published) : true}
              />
              Publish this media item
            </label>
          </div></details>
        )}

        {kind === 'news' && editing?.id && <NewsGalleryAdmin newsId={editing.id} adminKey={adminKey}/>}
        {kind === 'events' && editing?.id && <EventGalleryAdmin eventId={editing.id} adminKey={adminKey}/>}
        {(kind==='news'||kind==='events')&&!editing?.id&&<div className="gallery-after-save-note"><ImageIcon/><span>Publish this item first, then click Edit to add multiple gallery photographs.</span></div>}

        <div className="cms-form-actions">
          <button type="submit" className="btn primary" disabled={busy}>
            <Save/> {busy ? 'Saving…' : editing ? 'Save Changes' : 'Publish'}
          </button>
          {editing && (
            <button
              type="button"
              className="cms-cancel"
              onClick={() => setEditing(null)}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="cms-records">
        <div className="cms-records-head">
          <div>
            <h2>Existing {kind}</h2>
            <span>{rows.length} records</span>
          </div>
          {rows.length>0&&(
            <div className="bulk-actions">
              <button type="button" onClick={toggleSelectAll}>
                {selectedIds.size===rows.length?'Clear selection':'Select all'}
              </button>
              <button
                type="button"
                className="bulk-delete"
                disabled={!selectedIds.size||bulkDeleting}
                onClick={deleteSelected}
              >
                <Trash2/> {bulkDeleting?'Deleting…':`Delete selected (${selectedIds.size})`}
              </button>
            </div>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">
            <FileText/>
            <h3>No records yet</h3>
            <p>Create the first item using the form.</p>
          </div>
        ) : (
          rows.map(r => (
            <article key={r.id}>
              <div>
                <small>{String(r.category || r.asset_type || r.ward || kind)}</small>
                <h3>{String(r.title || 'Untitled')}</h3>
                <p>{String(r.summary || r.description || r.file_url || '')}</p>
                <span>
                  {r.published === false ? 'Draft • ' : 'Published • '}
                  {String(r.published_at || r.event_date || r.created_at || '')}
                </span>
              </div>
              <div className="cms-row-actions">
                <button
                  className="edit-icon"
                  aria-label="Edit"
                  onClick={() => setEditing(r)}
                >
                  <Edit3/>
                </button>
                <button
                  className="danger-icon"
                  aria-label="Delete"
                  onClick={() => onDelete(kind, r.id)}
                >
                  <Trash2/>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

function PublicApp() {
  const [content,setContent]=React.useState<Content>(fallbackContent)
  React.useEffect(()=>{fetch('/api/content').then(r=>r.ok?r.json():{}).then(data=>setContent({...fallbackContent,...data})).catch(()=>setContent(fallbackContent))},[])
  const path=window.location.pathname.replace(/\/+$/,'')||'/'
  React.useEffect(()=>updateSeo(path,content),[path,content])
  if(path==='/admin') return <AdminPage content={content} setContent={setContent}/>
  if(path.startsWith('/news/')) return <Layout content={content}><NewsDetailPage slug={decodeURIComponent(path.slice('/news/'.length))} content={content}/></Layout>
  if(path.startsWith('/events/')) return <Layout content={content}><EventDetailPage id={decodeURIComponent(path.slice('/events/'.length))} content={content}/></Layout>
  let page:React.ReactNode
  if(path==='/') page=<HomePage content={content}/>
  else if(path==='/about') page=<AboutPage content={content}/>
  else if(path==='/agenda') page=<AgendaPage/>
  else if(path==='/news') page=<NewsPage/>
  else if(path==='/events') page=<EventsPage/>
  else if(path==='/media') page=<MediaPage content={content}/>
  else if(path==='/contact') page=<ContactPage content={content}/>
  else if(path==='/volunteer') page=<VolunteerPage/>
  else if(path==='/privacy') page=<LegalPage type="privacy"/>
  else if(path==='/terms') page=<LegalPage type="terms"/>
  else if(path==='/accessibility') page=<LegalPage type="accessibility"/>
  else page=<NotFoundPage/>
  return <Layout content={content}>{page}</Layout>
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><PublicApp/></React.StrictMode>)
