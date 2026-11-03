/**
 * Prerender the app into dist/index.html after `vite build`.
 *
 * - Renders <App /> to static HTML so the hero paints before (and without) JS.
 * - Inlines the built stylesheet so first paint needs a single request.
 *
 * Run via `npm run build`.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'

const root = process.cwd()
const indexPath = path.join(root, 'dist/index.html')

const vite = await createServer({
  root,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
})

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
  const appHtml = render()

  let html = await readFile(indexPath, 'utf8')

  if (!html.includes('<div id="root"></div>')) {
    throw new Error('prerender: could not find an empty #root in dist/index.html')
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  // Inline the single built stylesheet (≈14 kB gzipped) to remove a
  // render-blocking request from the critical path.
  const linkRe = /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/
  const match = html.match(linkRe)
  if (match) {
    const cssPath = path.join(root, 'dist', match[1].replace(/^\//, ''))
    let css = await readFile(cssPath, 'utf8')
    css = css.replace(/<\/style/gi, '<\\/style')
    html = html.replace(match[0], `<style>${css}</style>`)
  }

  await writeFile(indexPath, html)
  console.log(`Prerendered dist/index.html (${(html.length / 1024).toFixed(1)} kB)`)
} finally {
  await vite.close()
}
