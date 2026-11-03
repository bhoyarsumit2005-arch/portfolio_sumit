import { useEffect, useState } from 'react'

/* Only enable a certificate link when its PDF is really served (avoids the
   SPA fallback returning index.html for a missing file). Runs when the browser
   is idle so it never competes with the first paint. */
export default function useCertificateStatus(certifications, { immediate = false } = {}) {
  const [status, setStatus] = useState({})

  useEffect(() => {
    let cancelled = false

    const check = async (cert) => {
      try {
        const response = await fetch(cert.file, { method: 'HEAD' })
        const type = (response.headers.get('content-type') || '').toLowerCase()
        const ready = response.ok && type.includes('pdf')
        if (!cancelled) setStatus((prev) => ({ ...prev, [cert.title]: ready }))
      } catch {
        if (!cancelled) setStatus((prev) => ({ ...prev, [cert.title]: false }))
      }
    }

    const run = () => {
      certifications.filter((cert) => cert.file).forEach(check)
    }

    if (immediate) {
      run()
      return () => {
        cancelled = true
      }
    }

    const hasIdle = typeof window.requestIdleCallback === 'function'
    const handle = hasIdle ? window.requestIdleCallback(run, { timeout: 3000 }) : window.setTimeout(run, 1200)

    return () => {
      cancelled = true
      if (hasIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [certifications, immediate])

  return status
}
