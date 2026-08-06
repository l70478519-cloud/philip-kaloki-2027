import React from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowRight, CheckCircle2, HeartHandshake, Landmark, Mail, MapPin, Menu, Phone, ShieldCheck, Sprout, Users, X } from 'lucide-react'
import './styles.css'

type CardProps = { icon: React.ReactNode; title: string; text: string }

const pillars: CardProps[] = [
  { icon: <Sprout />, title: 'Agriculture & Water', text: 'Expand irrigation, strengthen farmer value chains and improve reliable access to water.' },
  { icon: <HeartHandshake />, title: 'Accessible Healthcare', text: 'Build a responsive health system with equipped facilities, medicine and dignified care.' },
  { icon: <Users />, title: 'Youth & Women', text: 'Create pathways to jobs, enterprise, skills development and inclusive county leadership.' },
  { icon: <Landmark />, title: 'Accountable Government', text: 'Restore trust through transparent budgeting, public participation and measurable delivery.' }
]

function App() {
  const [open, setOpen] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  return (
    <div>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>Leadership that listens. Development that reaches every household.</span>
          <div><Phone size={15}/> +254 700 000 000 <Mail size={15}/> info@philipkaloki.com</div>
        </div>
      </div>

      <header className="header">
        <div className="container nav">
          <a className="brand" href="#home">
            <span className="brand-mark">PK</span>
            <span><strong>PROF. PHILIP KALOKI</strong><small>MAKUENI COUNTY • 2027</small></span>
          </a>
          <nav className={open ? 'nav-links open' : 'nav-links'}>
            <a href="#home" onClick={() => setOpen(false)}>Home</a>
            <a href="#about" onClick={() => setOpen(false)}>About</a>
            <a href="#vision" onClick={() => setOpen(false)}>Vision</a>
            <a href="#priorities" onClick={() => setOpen(false)}>Priorities</a>
            <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
            <a className="nav-cta" href="#join" onClick={() => setOpen(false)}>Join the Movement</a>
          </nav>
          <button className="menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-overlay"></div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">A NEW CHAPTER FOR MAKUENI</div>
              <h1>Development.<br/><span>Integrity.</span><br/>Prosperity.</h1>
              <p>A people-centred movement committed to practical solutions, accountable leadership and opportunity for every family in Makueni County.</p>
              <div className="hero-actions">
                <a className="btn primary" href="#vision">Explore the Vision <ArrowRight size={18}/></a>
                <a className="btn secondary" href="#join">Become a Volunteer</a>
              </div>
              <div className="trust-row">
                <span><CheckCircle2/> Experienced leadership</span>
                <span><CheckCircle2/> People-first development</span>
              </div>
            </div>
            <div className="candidate-card">
              <div className="portrait-placeholder">
                <div className="portrait-initials">PK</div>
                <p>Place official campaign portrait here</p>
              </div>
              <div className="candidate-caption"><strong>Prof. Philip Kaloki</strong><span>For Governor • Makueni County 2027</span></div>
            </div>
          </div>
        </section>

        <section className="statement">
          <div className="container statement-grid">
            <div><span>OUR COMMITMENT</span><h2>A government that works for the people.</h2></div>
            <p>We believe progress must be visible in the lives of ordinary citizens—in working hospitals, productive farms, thriving businesses, empowered young people and public institutions that serve with integrity.</p>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container split">
            <div className="image-panel"><div className="image-label">Leadership • Service • Results</div></div>
            <div className="content">
              <div className="section-kicker">MEET THE CANDIDATE</div>
              <h2>Proven leadership with a clear vision for Makueni.</h2>
              <p>Prof. Philip Kaloki's leadership journey is founded on public service, professional excellence and a deep commitment to improving lives. His 2027 agenda puts communities at the centre of county development.</p>
              <div className="mini-points">
                <div><ShieldCheck/><span><strong>Integrity in leadership</strong><small>Transparent decisions and responsible use of public resources.</small></span></div>
                <div><Users/><span><strong>Inclusive development</strong><small>Every ward, village and household must be part of Makueni's progress.</small></span></div>
              </div>
              <a className="text-link" href="#vision">Read the development agenda <ArrowRight size={17}/></a>
            </div>
          </div>
        </section>

        <section id="vision" className="vision-section">
          <div className="container center-heading">
            <div className="section-kicker light">THE 2027 VISION</div>
            <h2>A prosperous, healthy and united Makueni.</h2>
            <p>Our agenda is built around practical priorities that create lasting change and measurable results.</p>
          </div>
          <div id="priorities" className="container cards">
            {pillars.map((p) => <article className="pillar" key={p.title}><div className="icon-wrap">{p.icon}</div><h3>{p.title}</h3><p>{p.text}</p><a href="#contact">Learn more <ArrowRight size={15}/></a></article>)}
          </div>
        </section>

        <section id="join" className="join-section">
          <div className="container join-card">
            <div><div className="section-kicker">JOIN THE MOVEMENT</div><h2>Your voice. Your community. Your future.</h2><p>Volunteer, share your ideas or help mobilize your community. Together, we can build the Makueni we deserve.</p></div>
            <div className="join-actions"><a className="btn primary" href="#contact">Register as a Volunteer</a><a className="btn outline" href="#contact">Share Your Ideas</a></div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-grid">
            <div>
              <div className="section-kicker">CONTACT THE CAMPAIGN</div>
              <h2>We are ready to hear from you.</h2>
              <p>Send a question, invitation, development proposal or volunteering request to the campaign secretariat.</p>
              <div className="contact-list">
                <div><MapPin/><span><strong>Campaign Secretariat</strong><small>Wote, Makueni County</small></span></div>
                <div><Phone/><span><strong>Telephone</strong><small>+254 700 000 000</small></span></div>
                <div><Mail/><span><strong>Email</strong><small>info@philipkaloki.com</small></span></div>
              </div>
            </div>
            <form className="contact-form" onSubmit={(e) => {e.preventDefault(); setSent(true)}}>
              <div className="form-row"><label>Full name<input required placeholder="Your full name"/></label><label>Phone number<input required placeholder="07xx xxx xxx"/></label></div>
              <div className="form-row"><label>Email address<input type="email" placeholder="you@example.com"/></label><label>Area of interest<select defaultValue=""><option value="" disabled>Select one</option><option>General enquiry</option><option>Volunteer</option><option>Media request</option><option>Event invitation</option><option>Development proposal</option></select></label></div>
              <label>Your message<textarea required rows={5} placeholder="How can the campaign assist you?"/></label>
              <button className="btn primary submit" type="submit">Send Message <ArrowRight size={18}/></button>
              {sent && <div className="success">Thank you. Your message has been recorded in this demo.</div>}
            </form>
          </div>
        </section>
      </main>

      <footer><div className="container footer-grid"><div className="brand footer-brand"><span className="brand-mark">PK</span><span><strong>PROF. PHILIP KALOKI</strong><small>MAKUENI COUNTY • 2027</small></span></div><p>Development. Integrity. Prosperity for every household.</p><small>© 2027 Philip Kaloki Campaign. Demo website.</small></div></footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
