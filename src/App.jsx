import { useCallback, useEffect, useState } from 'react'
import ResumeModal from './components/ResumeModal'
import { profile, skillGroups, learning, projects, education, certifications } from './data/portfolio'

const navItems = [
  ['About', 'about'],
  ['Skills', 'skills'],
  ['Projects', 'projects'],
  ['Education', 'education'],
  ['Contact', 'contact'],
]

const tickerItems = ['SOFTWARE DEVELOPMENT', 'WEB TECHNOLOGIES', 'ARTIFICIAL INTELLIGENCE', 'CONTINUOUS LEARNING']

/* Fade-up reveal animation for elements as they enter the viewport */
function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('revealed'))
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function SectionHeading({ eyebrow, title, note }) {
  const [number, ...rest] = eyebrow.split('/')
  const label = rest.join('/').trim()
  return (
    <div className="section-heading" data-reveal>
      <div>
        <p className="eyebrow">
          <span className="eyebrow-number">{number.trim()}</span>
          <span className="eyebrow-label">{label}</span>
          <span className="eyebrow-rule" aria-hidden="true" />
        </p>
        <h2>{title}</h2>
      </div>
      {note && <p className="section-note">{note}</p>}
    </div>
  )
}

function Portrait() {
  const [photoFailed, setPhotoFailed] = useState(false)
  return (
    <div className="portrait-frame">
      <div className="portrait-media">
        {photoFailed ? (
          <div className="portrait-placeholder">
            <div className="portrait-initials">
              SB<span>.</span>
            </div>
            <p>Your photo goes here</p>
            <span className="portrait-hint">
              Add it at <code>public/images/profile.jpg</code>
            </span>
          </div>
        ) : (
          <picture>
            <source srcSet="/images/profile.webp" type="image/webp" />
            <img
              className="portrait-photo"
              src="/images/profile.jpg"
              alt="Portrait of Sumit Bhoyar"
              width="640"
              height="960"
              loading="eager"
              fetchPriority="high"
              onError={() => setPhotoFailed(true)}
            />
          </picture>
        )}
      </div>
      <div className="photo-caption">
        <span>SUMIT BHOYAR</span>
        <span>AI · WEB · SOFTWARE</span>
      </div>
    </div>
  )
}

function Ticker() {
  return (
    <div className="ticker" aria-label="Areas of interest">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
            {tickerItems.map((item) => (
              <span key={item}>
                {item} <i>✳</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Only enable a certificate link when its PDF is really served (avoids the
   SPA fallback returning index.html for a missing file). */
function useCertificateStatus(certifications) {
  const [status, setStatus] = useState({})

  useEffect(() => {
    let cancelled = false
    certifications
      .filter((cert) => cert.file)
      .forEach(async (cert) => {
        try {
          const response = await fetch(cert.file, { method: 'HEAD', cache: 'no-store' })
          const type = (response.headers.get('content-type') || '').toLowerCase()
          const ready = response.ok && type.includes('pdf')
          if (!cancelled) setStatus((prev) => ({ ...prev, [cert.title]: ready }))
        } catch {
          if (!cancelled) setStatus((prev) => ({ ...prev, [cert.title]: false }))
        }
      })
    return () => {
      cancelled = true
    }
  }, [certifications])

  return status
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resumeOpen, setResumeOpen] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('resume'),
  )

  const closeResume = useCallback(() => setResumeOpen(false), [])
  const certStatus = useCertificateStatus(certifications)

  useRevealOnScroll()

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? doc.scrollTop / max : 0)
      setScrolled(doc.scrollTop > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <a className="wordmark" href="#home" onClick={closeMenu}>
            SB<span>.</span>
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            ) : (
              <i className="fa-solid fa-bars" aria-hidden="true" />
            )}
          </button>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
            {navItems.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={closeMenu}>
                {label}
              </a>
            ))}
            <a className="nav-contact" href="#contact" onClick={closeMenu}>
              Say hello <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="availability" data-reveal>
              <span className="status-dot" /> Open to internship opportunities
            </div>
            <p className="eyebrow eyebrow-plain" data-reveal style={{ '--reveal-delay': '.06s' }}>
              AI ENGINEERING STUDENT · DEVELOPER
            </p>
            <h1 data-reveal style={{ '--reveal-delay': '.12s' }}>
              Building useful things
              <br />
              with <span className="hl">thoughtful code.</span>
            </h1>
            <p className="hero-intro" data-reveal style={{ '--reveal-delay': '.2s' }}>
              Hi, I’m Sumit — a full stack developer and AI engineering student who enjoys turning ideas into
              practical digital experiences.
            </p>
            <div className="hero-actions" data-reveal style={{ '--reveal-delay': '.28s' }}>
              <a className="button button-dark" href="#projects">
                Explore my work <i className="fa-solid fa-arrow-down" aria-hidden="true" />
              </a>
              <div className="resume-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => setResumeOpen(true)}
                  aria-haspopup="dialog"
                >
                  <i className="fa-solid fa-file-lines" aria-hidden="true" /> Preview resume
                </button>
                <a
                  className="resume-download"
                  href="/files/Sumit-Bhoyar-Resume.pdf"
                  download
                  aria-label="Download resume as PDF"
                  title="Download resume"
                >
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="hero-location" data-reveal style={{ '--reveal-delay': '.34s' }}>
              <i className="fa-solid fa-location-dot" aria-hidden="true" /> {profile.location}
            </div>
          </div>

          <div className="hero-art" data-reveal style={{ '--reveal-delay': '.2s' }}>
            <Portrait />
            <div className="art-note">
              <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
              <span>
                Curious by nature.
                <br />
                Builder by practice.
              </span>
            </div>
            <span className="art-index">PORTFOLIO / 2026</span>
          </div>
        </section>

        <Ticker />

        <section className="section-wrap section-block" id="about">
          <SectionHeading
            eyebrow="01 / A LITTLE ABOUT ME"
            title="Learning loudly. Building quietly."
            note="A quick look at how I think, what I care about, and where I’m headed next."
          />
          <div className="about-grid">
            <div className="about-copy" data-reveal>
              <p className="about-lead">
                I’m Sumit — an AI engineering student who found his way into software through curiosity. What
                started as wondering how websites actually work turned into a habit of building them:{' '}
                <span className="hl-inline">interfaces, APIs, databases</span> and the occasional late-night
                experiment.
              </p>
              <p className="about-lead about-lead-secondary">
                I care about software that stays clear and useful long after it ships — code you can read six
                months later and still understand. Right now I’m sharpening my full stack skills while exploring
                how AI can make everyday tools genuinely smarter.
              </p>
              <p className="about-quote">“Build something small. Make it work. Then make it better.”</p>
              <div className="about-principles">
                {['Clarity over cleverness', 'Learn by shipping', 'Details matter'].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="facts-grid">
              {[
                ['Focus', 'Full stack & applied AI'],
                ['Currently', 'B.Tech in Artificial Intelligence'],
                ['Based in', 'Nagpur, Maharashtra'],
                ['Open to', 'Internships & collaborations'],
              ].map(([label, value], i) => (
                <div className="fact" key={label} data-reveal style={{ '--reveal-delay': `${i * 0.07}s` }}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="skills-section" id="skills">
          <div className="section-wrap section-block">
            <SectionHeading
              eyebrow="02 / THE STACK I BUILD WITH"
              title="The stack behind the work."
              note="From the first sketch to the final deploy — the tools I reach for to turn ideas into working products."
            />
            <div className="skill-grid">
              {skillGroups.map((group, i) => (
                <article
                  className="skill-card"
                  key={group.title}
                  data-reveal
                  style={{ '--reveal-delay': `${i * 0.08}s` }}
                >
                  <div className="skill-card-top">
                    <span className="skill-number">0{i + 1}</span>
                    <i className={`fa-solid ${group.icon}`} aria-hidden="true" />
                  </div>
                  <h3>{group.title}</h3>
                  <p className="skill-blurb">{group.blurb}</p>
                  <div className="skill-tags">
                    {group.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="skill-extra" data-reveal>
              <div className="skill-extra-intro">
                <span className="skill-extra-icon">
                  <i className="fa-solid fa-flask" aria-hidden="true" />
                </span>
                <p className="skill-extra-eyebrow">CURRENTLY EXPLORING</p>
                <h3>Always one experiment ahead.</h3>
                <p className="skill-extra-copy">
                  Beyond the projects above, I keep a small playground of ideas I’m testing — new tools, patterns
                  and ways of building that make the next project a little better than the last.
                </p>
              </div>
              <div className="skill-extra-list">
                {learning.map((item) => (
                  <div className="learning-item" key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap section-block" id="projects">
          <SectionHeading
            eyebrow="03 / SELECTED WORK"
            title="A few things I’ve built."
            note="Hands-on projects where I’ve put my learning into practice."
          />
          <div className="project-list">
            {projects.map((project, i) => (
              <article
                className="project-card"
                key={project.name}
                data-reveal
                style={{ '--reveal-delay': `${i * 0.1}s` }}
              >
                <div className={`project-visual ${project.visual}`}>
                  <div className="mock-window">
                    <div className="mock-top">
                      <span />
                      <span />
                      <span />
                      <i>{project.name}</i>
                    </div>
                    {project.visual === 'resume' ? (
                      <div className="resume-mock">
                        <div className="mock-sidebar">
                          <b />
                          <b />
                          <b />
                          <b />
                        </div>
                        <div className="mock-page">
                          <div className="mock-avatar" />
                          <div className="mock-line long" />
                          <div className="mock-line mid" />
                          <div className="mock-rule" />
                          <div className="mock-line long" />
                          <div className="mock-line short" />
                          <div className="mock-rule" />
                          <div className="mock-line mid" />
                          <div className="mock-line long" />
                        </div>
                      </div>
                    ) : (
                      <div className="chat-mock">
                        <div className="chat-message user-msg">Help me turn an idea into a project.</div>
                        <div className="chat-message ai-msg">
                          <span className="ai-mark">✳</span>
                          <div className="ai-body">
                            <div className="mock-line long" />
                            <div className="mock-line mid" />
                            <div className="mock-line long" />
                          </div>
                        </div>
                        <div className="chat-message ai-msg typing" aria-hidden="true">
                          <span className="ai-mark">✳</span>
                          <span className="typing-dots">
                            <i />
                            <i />
                            <i />
                          </span>
                        </div>
                        <div className="chat-input">
                          Ask SigmaGPT anything… <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="visual-label">PROJECT {project.number}</span>
                </div>
                <div className="project-content">
                  <div className="project-title-row">
                    <div>
                      <p className="project-type">{project.type}</p>
                      <h3>{project.name}</h3>
                    </div>
                    <a
                      className="circle-link"
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open GitHub profile for ${project.name}`}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.stack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
                    Explore on GitHub <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                  </a>
                  <p className="repo-note">Opens your GitHub profile — add the individual repository URL when ready.</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="education-section" id="education">
          <div className="section-wrap section-block">
            <SectionHeading eyebrow="04 / LEARNING PATH" title="Education & credentials." />
            <div className="education-layout">
              <div className="timeline">
                {education.map((item, i) => (
                  <article
                    className="timeline-item"
                    key={item.title}
                    data-reveal
                    style={{ '--reveal-delay': `${i * 0.1}s` }}
                  >
                    <div className="timeline-marker">
                      <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-date">{item.date}</span>
                      <h3>{item.title}</h3>
                      <p>{item.place}</p>
                      <span className="result-pill">{item.result}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="cert-panel" data-reveal style={{ '--reveal-delay': '.12s' }}>
                <p className="eyebrow eyebrow-plain">CERTIFICATIONS</p>
                {certifications.map((cert) => {
                  const ready = Boolean(cert.file && certStatus[cert.title])
                  const body = (
                    <>
                      <div className="cert-icon">
                        <i className="fa-solid fa-certificate" aria-hidden="true" />
                      </div>
                      <div>
                        <h3>{cert.title}</h3>
                        <p>{cert.provider}</p>
                      </div>
                      {ready ? (
                        <span className="cert-open" aria-hidden="true">
                          <i className="fa-solid fa-arrow-up-right-from-square" />
                        </span>
                      ) : (
                        <span className="cert-open is-pending" title="Certificate PDF not uploaded yet">
                          <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )

                  return ready ? (
                    <a
                      className="cert-item cert-item-link"
                      key={cert.title}
                      href={cert.file}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${cert.title} certificate (PDF, new tab)`}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="cert-item" key={cert.title}>
                      {body}
                    </div>
                  )
                })}
              
                
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap contact-section" id="contact">
          <div className="contact-panel" data-reveal>
            <div className="contact-left">
              <p className="eyebrow">
                <span className="eyebrow-number">05</span>
                <span className="eyebrow-label">YOUR NEXT COLLABORATOR?</span>
              </p>
              <h2>
                Let’s make
                <br />
                <span className="hl">something useful.</span>
              </h2>
              <p>Have an opportunity, a project idea, or just want to connect? I’d be happy to hear from you.</p>
              <a className="button button-cream" href={`mailto:${profile.email}`}>
                Email me <i className="fa-solid fa-paper-plane" aria-hidden="true" />
              </a>
            </div>
            <div className="contact-right">
              <a href={`mailto:${profile.email}`} data-reveal style={{ '--reveal-delay': '.1s' }}>
                <span className="contact-icon">
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                </span>
                <span>
                  <small>EMAIL</small>
                  <strong>{profile.email}</strong>
                </span>
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                data-reveal
                style={{ '--reveal-delay': '.18s' }}
              >
                <span className="contact-icon">
                  <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
                </span>
                <span>
                  <small>LINKEDIN</small>
                  <strong>Let’s connect professionally</strong>
                </span>
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                data-reveal
                style={{ '--reveal-delay': '.26s' }}
              >
                <span className="contact-icon">
                  <i className="fa-brands fa-github" aria-hidden="true" />
                </span>
                <span>
                  <small>GITHUB</small>
                  <strong>Explore my code</strong>
                </span>
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark" href="#home">
          SB<span>.</span>
        </a>
        <p>Designed & built with care.</p>
        <div className="footer-right">
          <span>© {new Date().getFullYear()} Sumit Bhoyar</span>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-github" aria-hidden="true" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
          </a>
        </div>
      </footer>

      <ResumeModal open={resumeOpen} onClose={closeResume} certificateStatus={certStatus} />

      <a href="#home" className={`back-to-top ${scrolled ? 'show' : ''}`} aria-label="Back to top">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" />
      </a>
    </>
  )
}

export default App
