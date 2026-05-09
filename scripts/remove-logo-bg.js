// One-off script: convert mgm-logo.jpg → mgm-logo.png with transparent white background
const path = require("path")
const fs = require("fs")
const sharp = require("sharp")

async function run() {
  const src = path.join(__dirname, "..", "public", "images", "mgm-logo.jpg")
  const dst = path.join(__dirname, "..", "public", "images", "mgm-logo.png")

  if (!fs.existsSync(src)) {
    console.error("Source not found:", src)
    process.exit(1)
  }

  // Load as raw RGBA so we can modify alpha per-pixel
  const img = sharp(src).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  // Threshold: pixels brighter than this on all RGB channels become transparent
  // We use a slightly soft threshold so faint anti-aliased edges still fade out.
  const HARD = 245 // fully white-ish → fully transparent
  const SOFT = 210 // start fading alpha from this brightness

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const minRGB = Math.min(r, g, b)

    if (minRGB >= HARD) {
      data[i + 3] = 0 // fully transparent
    } else if (minRGB >= SOFT) {
      // linear ramp from full opacity at SOFT to 0 at HARD
      const t = (minRGB - SOFT) / (HARD - SOFT)
      data[i + 3] = Math.round(255 * (1 - t))
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(dst)

  console.log("Wrote", dst)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
