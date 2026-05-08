import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()

const TARGET_DIRS = [
  'src/assets/foods',
  'src/assets/lunbo'
]

async function fileExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else {
      yield full
    }
  }
}

function toWebpPath(pngPath) {
  return pngPath.replace(/\.png$/i, '.webp')
}

async function convertPngToWebp(pngPath) {
  const webpPath = toWebpPath(pngPath)

  // Skip if already exists and is newer than source
  const exists = await fileExists(webpPath)
  if (exists) {
    const [srcStat, outStat] = await Promise.all([fs.stat(pngPath), fs.stat(webpPath)])
    if (outStat.mtimeMs >= srcStat.mtimeMs) return { status: 'skip', pngPath, webpPath }
  }

  const input = sharp(pngPath, { failOn: 'none' })

  // Resize very large images down to a reasonable max width.
  // - banners: 160px height in UI; 960px width is enough for most phones
  // - thumbs: card thumb ~88px; but we keep some room for retina and reuse
  const metadata = await input.metadata()
  const maxWidth = 1200
  const needResize = metadata.width && metadata.width > maxWidth

  const pipeline = needResize ? input.resize({ width: maxWidth, withoutEnlargement: true }) : input

  await pipeline
    .webp({ quality: 75, effort: 6 })
    .toFile(webpPath)

  return { status: 'ok', pngPath, webpPath }
}

async function main() {
  const absDirs = TARGET_DIRS.map(d => path.join(projectRoot, d))

  let converted = 0
  let skipped = 0

  for (const dir of absDirs) {
    for await (const filePath of walk(dir)) {
      if (!/\.png$/i.test(filePath)) continue
      const result = await convertPngToWebp(filePath)
      if (result.status === 'ok') converted += 1
      else skipped += 1
    }
  }

  console.log(`[optimize-images] converted=${converted} skipped=${skipped}`)
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
