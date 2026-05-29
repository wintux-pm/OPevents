import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dataDir = fileURLToPath(new URL('./public/data', import.meta.url))

function listDataFiles() {
  try {
    return readdirSync(dataDir)
      .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
      .sort()
  } catch {
    return []
  }
}

// Auto-generates /data/manifest.json listing every JSON file in public/data,
// so the app loads whatever data files exist without hardcoding them.
function dataManifest() {
  return {
    name: 'data-manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] === '/data/manifest.json') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(listDataFiles()))
          return
        }
        next()
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'data/manifest.json',
        source: JSON.stringify(listDataFiles()),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), dataManifest()],
})
