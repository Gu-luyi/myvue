import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const FORCE = process.argv.includes('--force')

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

function toThumbWebpPath(pngPath) {
  return pngPath.replace(/\.png$/i, '.thumb.webp')
}

async function convertPngToWebp(pngPath) {
  const webpPath = toWebpPath(pngPath)

  const rel = path.relative(projectRoot, pngPath).replace(/\\/g, '/')
  const isBanner = rel.startsWith('src/assets/lunbo/')
  const isFood = rel.startsWith('src/assets/foods/')
  const thumbPath = isFood ? toThumbWebpPath(pngPath) : null

  // Skip only if output is up-to-date (unless --force). Foods have two outputs.
  if (!FORCE) {
    const [srcStat, webpExists, thumbExists] = await Promise.all([
      fs.stat(pngPath),
      fileExists(webpPath),
      thumbPath ? fileExists(thumbPath) : Promise.resolve(true)
    ])

    if (webpExists) {
      const webpStat = await fs.stat(webpPath)
      const webpUpToDate = webpStat.mtimeMs >= srcStat.mtimeMs

      if (isFood) {
        const thumbUpToDate = thumbExists ? (await fs.stat(thumbPath)).mtimeMs >= srcStat.mtimeMs : false
        if (webpUpToDate && thumbUpToDate) return { status: 'skip', pngPath, webpPath }
      } else {
        if (webpUpToDate) return { status: 'skip', pngPath, webpPath }
      }
    }
  }

  const input = sharp(pngPath, { failOn: 'none' })

  const metadata = await input.metadata()
  const maxWidth = isBanner ? 960 : 1200
  const quality = isBanner ? 68 : 75
  const needResize = metadata.width && metadata.width > maxWidth

  const pipeline = needResize
    ? input.resize({ width: maxWidth, withoutEnlargement: true })
    : input

  await pipeline.webp({ quality, effort: 6 }).toFile(webpPath)

  // For list thumbnails, generate a much smaller variant.
  if (isFood) {
    const thumbMaxWidth = 320
    const thumbNeedResize = metadata.width && metadata.width > thumbMaxWidth
    const thumbPipeline = thumbNeedResize
      ? sharp(pngPath, { failOn: 'none' }).resize({ width: thumbMaxWidth, withoutEnlargement: true })
      : sharp(pngPath, { failOn: 'none' })
    await thumbPipeline.webp({ quality: 70, effort: 6 }).toFile(thumbPath)
  }

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
