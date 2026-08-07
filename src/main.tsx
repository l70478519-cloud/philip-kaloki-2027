import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ArrowRight, CalendarDays, CheckCircle2, ChevronUp, Droplets, Globe2 as Facebook,
  HeartHandshake, Camera as Instagram, Landmark, Mail, MapPin, Menu, MessageCircle, Megaphone,
  Newspaper, Phone, PlayCircle, ShieldCheck, Sprout, Stethoscope, Target, FileText, Download,
  Users, X, PlayCircle as Youtube, BriefcaseBusiness, GraduationCap, LockKeyhole, LayoutDashboard,
  Inbox, Save, Home as HomeIcon, LogOut, Settings, Eye, Check, Clock3, ExternalLink, Image as ImageIcon, FileCheck2, BarChart3
} from 'lucide-react'
import './styles.css'

type Content = {
  candidateName: string; campaignTitle: string; tagline: string; strapline: string; phone: string;
  email: string; whatsapp: string; office: string; heroText: string; biography: string;
  facebook: string; instagram: string; youtube: string; contentStatus: string;
}

type Submission = Record<string, string> & { id: string; type: string; createdAt: string; status: string }

const fallbackContent: Content = {
  candidateName: 'Prof. Philip Kaloki', campaignTitle: 'Makueni County • 2027', tagline: 'Development. Integrity. Prosperity.',
  strapline: 'Leadership that listens. Development that reaches every household.', phone: '+254 700 000 000',
  email: 'info@philipkaloki.com', whatsapp: '254700000000', office: 'Wote, Makueni County',
  heroText: 'A people-centred movement committed to practical solutions, accountable leadership and opportunity for every family in Makueni County.',
  biography: 'Prof. Philip Kaloki’s leadership journey is founded on public service, professional excellence and a deep commitment to improving lives. His 2027 agenda places communities at the centre of county development.',
  facebook: '#', instagram: '#', youtube: '#', contentStatus: 'Replace placeholder contact details and campaign wording with formally approved information before public launch.'
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
  React.useEffect(() => {
    fetch('/api/content')
      .then(r => r.ok ? r.json() : {})
      .then(data => setContent({ ...fallbackContent, ...data }))
      .catch(() => setContent(fallbackContent))
  }, [])
  return content
}

async function submit(type: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/submissions/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error('Submission failed')
  return res.json()
}

function Layout({ children, content }: { children: React.ReactNode; content: Content }) {
  const [open, setOpen] = React.useState(false)
  const [showTop, setShowTop] = React.useState(false)
  React.useEffect(() => { const f = () => setShowTop(window.scrollY > 600); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f) }, [])
  const links = [['/','Home'],['/about','About'],['/agenda','Agenda'],['/news','News'],['/media','Media'],['/contact','Contact']]
  return <div>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="topbar"><div className="container topbar-inner"><span>{content.strapline}</span><div><Phone size={15}/> {content.phone} <Mail size={15}/> {content.email}</div></div></div>
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
      <div><h4>Contact</h4><span>{content.office}</span><span>{content.phone}</span><span>{content.email}</span></div>
      <div><h4>Follow</h4><div className="socials"><a href={content.facebook}><Facebook/></a><a href={content.instagram}><Instagram/></a><a href={content.youtube}><Youtube/></a></div></div>
    </div><div className="container footer-bottom"><small>© 2027 Philip Kaloki Campaign.</small><small><a href="/privacy">Privacy</a> • <a href="/terms">Terms</a> • <a href="/accessibility">Accessibility</a> • <a href="/admin">Admin</a></small></div></footer>
  </div>
}

function PageHero({ kicker, title, text, image }: { kicker: string; title: string; text: string; image?: string }) {
  return <section className="page-hero"><div className="container page-hero-grid"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{text}</p></div>{image && <img src={image} alt=""/>}</div></section>
}

function HomePage({ content }: { content: Content }) {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow">A NEW CHAPTER FOR MAKUENI</div><h1>Development.<br/><span>Integrity.</span><br/>Prosperity.</h1><p>{content.heroText}</p><div className="hero-actions"><a className="btn primary" href="/agenda">Explore the Agenda <ArrowRight size={18}/></a><a className="btn secondary" href="/volunteer">Become a Volunteer</a></div><div className="trust-row"><span><CheckCircle2/> Experienced leadership</span><span><CheckCircle2/> People-first development</span></div></div><div className="candidate-card"><div className="portrait-photo"><img src="/assets/philip-kaloki-portrait-hero.webp" alt="Prof. Philip Kaloki"/></div><div className="candidate-caption"><strong>{content.candidateName}</strong><span>For Governor • Makueni County 2027</span></div></div></div></section>
    <section className="quick-impact"><div className="container impact-grid"><div><strong>30</strong><span>Wards to be heard</span></div><div><strong>6</strong><span>Core priorities</span></div><div><strong>1</strong><span>United county vision</span></div><div><strong>Every</strong><span>Household matters</span></div></div></section>
    <section className="statement"><div className="container statement-grid"><div><span>OUR COMMITMENT</span><h2>A government that works for the people.</h2></div><p>Progress must be visible in ordinary lives—in working hospitals, productive farms, thriving businesses, empowered young people and institutions that serve with integrity.</p></div></section>
    <section className="section"><div className="container split"><div className="image-panel about-photo"><img src="/assets/philip-kaloki-office.webp" alt="Prof. Philip Kaloki"/><div className="image-label">Leadership • Service • Results</div></div><div className="content"><div className="section-kicker">MEET THE CANDIDATE</div><h2>Proven leadership with a clear vision for Makueni.</h2><p>{content.biography}</p><div className="mini-points"><div><ShieldCheck/><span><strong>Integrity in leadership</strong><small>Transparent decisions and responsible use of public resources.</small></span></div><div><Users/><span><strong>Inclusive development</strong><small>Every ward, village and household must participate in Makueni’s progress.</small></span></div><div><Target/><span><strong>Measurable delivery</strong><small>Clear priorities and published progress.</small></span></div></div><a className="text-link" href="/about">Read full profile <ArrowRight size={17}/></a></div></div></section>
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

function NewsPage() { return <><PageHero kicker="NEWS & UPDATES" title="Follow the movement." text="Campaign updates, public engagements, policy conversations and official announcements." image="/assets/philip-kaloki-media-wide.webp"/><section className="section"><div className="container update-grid">{[...news,...news].map((item,i)=><article className="update-card" key={i}><div className="update-image photo-update"><img src={item.image}/></div><div className="update-body"><span>{item.tag}</span><small><CalendarDays/> Campaign update</small><h3>{item.title}</h3><p>Official campaign content can be posted here through the admin panel as the newsroom grows.</p><a href="/contact">Media enquiry <ArrowRight size={15}/></a></div></article>)}</div></section></> }

function MediaPage({ content }: { content: Content }) {
  const assets = [
    { src: '/assets/philip-kaloki-media.webp', label: 'Media engagement portrait' },
    { src: '/assets/philip-kaloki-office.webp', label: 'Leadership profile image' },
    { src: '/assets/philip-kaloki-field.webp', label: 'Field engagement image' },
    { src: '/assets/philip-kaloki-media-wide.webp', label: 'Wide media image' },
    { src: '/assets/philip-kaloki-portrait-hero.webp', label: 'Official website portrait' }
  ]
  return <><PageHero kicker="MEDIA CENTRE" title="Press, photos and campaign resources." text="A dedicated newsroom for journalists, broadcasters, photographers and campaign communications." image="/assets/philip-kaloki-media.webp"/>
    <section className="section"><div className="container media-resource-grid">
      <article className="media-resource"><FileCheck2/><div><small>PRESS RESOURCES</small><h3>Campaign media brief</h3><p>A concise reference with approved website biography, campaign theme and official contact channel.</p><a className="btn tertiary" href="/media/campaign-media-brief.txt" download>Download media brief <Download size={16}/></a></div></article>
      <article className="media-resource"><PlayCircle/><div><small>VIDEO</small><h3>Video library</h3><p>Speeches, interviews and campaign highlights can be linked to the official channel.</p><a className="text-link" href={content.youtube} target="_blank" rel="noreferrer">Open YouTube <ExternalLink size={15}/></a></div></article>
      <article className="media-resource"><Mail/><div><small>PRESS CONTACT</small><h3>Media enquiries</h3><p>Interview requests, event accreditation and fact-check requests should go through the campaign contact desk.</p><a className="text-link" href={`mailto:${content.email}`}>{content.email} <ArrowRight size={15}/></a></div></article>
    </div></section>
    <section className="gallery-section section"><div className="container section-heading-row"><div><div className="section-kicker">DOWNLOADABLE PHOTOGRAPHY</div><h2>Approved website image library.</h2></div></div><div className="container gallery-grid">{assets.map((item,i)=><article className="gallery-card downloadable" key={item.src}><img src={item.src} alt={item.label}/><div className="gallery-overlay"><ImageIcon/><div><strong>{item.label}</strong><a href={item.src} download>Download image <Download size={13}/></a></div></div></article>)}</div></section>
  </>
}

function ContactPage({ content }: { content: Content }) {
  const [state,setState] = React.useState('')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setState('sending'); const data = Object.fromEntries(new FormData(e.currentTarget)); try { await submit('contact', data); setState('sent'); e.currentTarget.reset() } catch { setState('error') } }
  return <><PageHero kicker="CONTACT THE CAMPAIGN" title="We are ready to hear from you." text="Send a question, invitation, development proposal or media request to the campaign secretariat."/><section className="section contact-section"><div className="container contact-grid"><div><div className="contact-list"><div><MapPin/><span><strong>Campaign Secretariat</strong><small>{content.office}</small></span></div><div><Phone/><span><strong>Telephone</strong><small>{content.phone}</small></span></div><div><Mail/><span><strong>Email</strong><small>{content.email}</small></span></div></div></div><form className="contact-form" onSubmit={onSubmit}><div className="form-row"><label>Full name<input name="name" required/></label><label>Phone number<input name="phone" required/></label></div><div className="form-row"><label>Email<input name="email" type="email"/></label><label>Subject<select name="subject" required defaultValue=""><option value="" disabled>Select one</option><option>General enquiry</option><option>Media request</option><option>Event invitation</option><option>Development proposal</option><option>Partnership</option></select></label></div><label>Your message<textarea name="message" required rows={6}/></label><input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><button className="btn primary submit" disabled={state==='sending'}>{state==='sending'?'Sending…':'Send Message'} <ArrowRight size={18}/></button>{state==='sent'&&<div className="success">Thank you. Your message has been saved.</div>}{state==='error'&&<div className="form-error">Could not submit. Start the API with <strong>npm run api</strong>.</div>}</form></div></section></>
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

function AdminPage({ content, setContent }: { content: Content; setContent: React.Dispatch<React.SetStateAction<Content>> }) {
  const [key,setKey]=React.useState(sessionStorage.getItem('pk-admin-key')||'')
  const [logged,setLogged]=React.useState(false)
  const [rows,setRows]=React.useState<Submission[]>([])
  const [tab,setTab]=React.useState<'inbox'|'content'>('inbox')
  const [message,setMessage]=React.useState('')
  const load=async(k=key)=>{const r=await fetch('/api/admin/submissions',{headers:{'x-admin-key':k}});if(!r.ok)throw new Error();setRows(await r.json());setLogged(true);sessionStorage.setItem('pk-admin-key',k)}
  const login=async(e:React.FormEvent)=>{e.preventDefault();try{await load();setMessage('')}catch{setMessage('Invalid admin key or API is not running.')}}
  const saveContent=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json','x-admin-key':key},body:JSON.stringify(data)});if(r.ok){const next=await r.json();setContent(prev => ({ ...fallbackContent, ...prev, ...next }));setMessage('Content saved.');}else setMessage('Save failed.')}
  if(!logged) return <section className="admin-shell"><div className="admin-login"><LockKeyhole/><h1>Campaign Admin</h1><p>Use the server-side <code>ADMIN_KEY</code> to access submissions and website content.</p><form onSubmit={login}><input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Admin key"/><button className="btn primary">Sign in</button></form>{message&&<div className="form-error">{message}</div>}<a href="/">← Back to website</a></div></section>
  return <section className="admin-shell"><aside className="admin-sidebar"><div className="brand"><span className="brand-mark">PK</span><span><strong>CAMPAIGN CMS</strong><small>PHASE 13–16</small></span></div><button className={tab==='inbox'?'active':''} onClick={()=>setTab('inbox')}><Inbox/> Submissions</button><button className={tab==='content'?'active':''} onClick={()=>setTab('content')}><Settings/> Website content</button><a href="/"><Eye/> View website</a><button onClick={()=>{sessionStorage.removeItem('pk-admin-key');location.reload()}}><LogOut/> Sign out</button></aside><div className="admin-main"><div className="admin-top"><div><span>CAMPAIGN SECRETARIAT</span><h1>{tab==='inbox'?'Submission Inbox':'Official Content'}</h1></div><div className="admin-count"><LayoutDashboard/> {rows.length} records</div></div>{message&&<div className="admin-message">{message}</div>}{tab==='inbox'?<div className="submission-list">{rows.length===0?<div className="empty-state"><Inbox/><h3>No submissions yet</h3><p>Contact and volunteer submissions will appear here.</p></div>:rows.map(r=><article key={r.id}><div className="submission-head"><span className={`status ${r.status}`}>{r.status==='new'?<Clock3/>:<Check/>}{r.status}</span><strong>{r.type.toUpperCase()}</strong><small>{new Date(r.createdAt).toLocaleString()}</small></div><h3>{r.name||r.email||'Website submission'}</h3><p>{r.message||r.subject||r.interest||'Newsletter subscription'}</p><div className="submission-meta">{Object.entries(r).filter(([k])=>!['id','type','createdAt','status','message'].includes(k)).slice(0,6).map(([k,v])=><span key={k}><b>{k}:</b> {v}</span>)}</div></article>)}</div>:<form className="admin-content-form" onSubmit={saveContent}>{Object.entries(content).map(([k,v])=><label key={k}>{k}<textarea name={k} defaultValue={v} rows={k==='biography'||k==='heroText'?4:2}/></label>)}<button className="btn primary"><Save/> Save Official Content</button></form>}</div></section>
}

function PublicApp() {
  const [content,setContent]=React.useState<Content>(fallbackContent)
  React.useEffect(()=>{
    fetch('/api/content')
      .then(r=>r.ok?r.json():{})
      .then(data=>setContent({...fallbackContent,...data}))
      .catch(()=>setContent(fallbackContent))
  },[])
  const path=window.location.pathname.replace(/\/+$/,'')||'/'
  React.useEffect(()=>updateSeo(path,content),[path,content])
  if(path==='/admin') return <AdminPage content={content} setContent={setContent}/>
  let page:React.ReactNode
  if(path==='/') page=<HomePage content={content}/>
  else if(path==='/about') page=<AboutPage content={content}/>
  else if(path==='/agenda') page=<AgendaPage/>
  else if(path==='/news') page=<NewsPage/>
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
