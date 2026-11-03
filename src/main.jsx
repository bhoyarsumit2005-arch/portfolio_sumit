import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const container = document.getElementById('root')
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Builds are prerendered to static HTML, so hydrate when markup is present and
// fall back to a client render during `vite dev` / when prerendering is skipped.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
