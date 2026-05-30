import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash, createCipheriv, randomBytes } from 'node:crypto'

const dataDir = fileURLToPath(new URL('./public/data', import.meta.url))

// Shared with the client (src/utils/crypto.js). Must stay in sync.
const DATA_KEY =
  process.env.VITE_DATA_KEY || 'op-events-default-data-key-change-me'

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
//
// During `vite dev` the files are served as plain JSON for convenience. In a
// production build they are encrypted (see dataEncrypt), and the manifest then
// lists the encrypted ".json.enc" filenames instead.
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
  }
}

// AES-256-GCM encrypts every data JSON in the build output. Files from public/
// (via the symlink) are copied to dist/data by Vite *outside* the Rollup bundle,
// so we process them on disk in closeBundle, once the copy has happened. Each
// plaintext file is replaced by an encrypted ".json.enc" laid out as:
//   [ iv (12 bytes) | ciphertext | GCM auth tag (16 bytes) ]
// and the manifest is rewritten to point at the encrypted names. The client
// reverses this in src/utils/crypto.js with the same key derivation
// (SHA-256 of DATA_KEY).
//
// NOTE: this is obfuscation, not real security — a static client must ship the
// key in its bundle. It stops trivial scraping of the raw JSON, nothing more.
function dataEncrypt() {
  const key = createHash('sha256').update(DATA_KEY).digest()

  function encrypt(plaintext) {
    const iv = randomBytes(12)
    const cipher = createCipheriv('aes-256-gcm', key, iv)
    const enc = Buffer.concat([cipher.update(plaintext), cipher.final()])
    const tag = cipher.getAuthTag()
    return Buffer.concat([iv, enc, tag])
  }

  let outDir = 'dist'

  return {
    name: 'data-encrypt',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const outDataDir = join(outDir, 'data')
      for (const file of listDataFiles()) {
        const src = join(outDataDir, file)
        const plaintext = readFileSync(src)
        writeFileSync(`${src}.enc`, encrypt(plaintext))
        rmSync(src) // drop plaintext so only the encrypted file ships
      }

      // Manifest lists the encrypted filenames so the client fetches those.
      writeFileSync(
        join(outDataDir, 'manifest.json'),
        JSON.stringify(listDataFiles().map((f) => `${f}.enc`)),
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), dataManifest(), dataEncrypt()],
})
