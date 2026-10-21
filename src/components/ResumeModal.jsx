import { useEffect, useRef } from 'react'
import { profile, projects, education, certifications, resumeSummary, languages } from '../data/portfolio'

const RESUME_URL = '/files/Sumit-Bhoyar-Resume.pdf'

const resumeSkills = [
  'JavaScript',
  'Node.js',
  'MongoDB',
  'Python',
  'REST APIs',
  'React.js',
  'Express.js',
  'Java',
  'Git & GitHub',
  'SQL',
]

function ResumeModal({ open, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="resume-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Resume preview"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="resume-modal-panel" ref={panelRef}>
        <div className="resume-modal-bar">
          <span className="resume-modal-title">
            <i className="fa-solid fa-file-lines" aria-hidden="true" />
            <span>Sumit-Bhoyar-Resume.pdf</span>
          </span>
          <div className="resume-modal-actions">
            <a className="resume-modal-download" href={RESUME_URL} download>
              <i className="fa-solid fa-download" aria-hidden="true" /> <span>Download</span>
            </a>
            <a
              className="resume-modal-open"
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open resume PDF in a new tab"
              title="Open PDF in a new tab"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </a>
            <button
              className="resume-modal-close"
              type="button"
              onClick={onClose}
              ref={closeRef}
              aria-label="Close resume preview"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="resume-modal-frame">
          <article className="resume-sheet">
            <header className="resume-sheet-head">
              <div>
                <p className="resume-sheet-role">B.Tech AI Engineering Student · Full Stack Developer</p>
                <h2>{profile.name}</h2>
              </div>
              <ul className="resume-sheet-contact">
                <li>
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                  {profile.email}
                </li>
                <li>
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  {profile.location}
                </li>
                <li>
                  <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
                  linkedin.com/in/sumit-bhoyar-ai-engineer
                </li>
                <li>
                  <i className="fa-brands fa-github" aria-hidden="true" />
                  github.com/bhoyarsumit2005-arch
                </li>
              </ul>
            </header>

            <section>
              <h3>Professional summary</h3>
              <p>{resumeSummary}</p>
            </section>

            <section>
              <h3>Education</h3>
              {education.map((item) => (
                <div className="resume-row" key={item.title}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>
                      {item.place} · {item.result}
                    </p>
                  </div>
                  <span>{item.date}</span>
                </div>
              ))}
            </section>

            <section>
              <h3>Projects</h3>
              {projects.map((project) => (
                <div className="resume-project" key={project.name}>
                  <div className="resume-row">
                    <h4>{project.name}</h4>
                    <span>{project.stack.slice(0, 3).join(' · ')}</span>
                  </div>
                  <p>{project.description}</p>
                </div>
              ))}
            </section>

            <section>
              <h3>Skills</h3>
              <ul className="resume-sheet-skills">
                {resumeSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>

            <div className="resume-sheet-split">
              <section>
                <h3>Certifications</h3>
                {certifications.map((cert) => (
                  <div className="resume-row" key={cert.title}>
                    <div>
                      <h4>{cert.title}</h4>
                      <p>{cert.provider}</p>
                    </div>
                  </div>
                ))}
              </section>

              <section>
                <h3>Languages</h3>
                {languages.map(([language, level]) => (
                  <div className="resume-row" key={language}>
                    <div>
                      <h4>{language}</h4>
                    </div>
                    <span>{level}</span>
                  </div>
                ))}
              </section>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default ResumeModal
