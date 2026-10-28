// Font files sirf tab load hoti hain jab public/fonts/ mein maujood hon.
// File na ho to koi console error nahi aata, site fallback fonts use karti hai.
const FONTS = [
  ['JNK', '/fonts/JameelNooriNastaleeq.ttf'],
]

export default function loadLocalFonts() {
  FONTS.forEach(async ([family, url]) => {
    try {
      const res = await fetch(url)
      const type = res.headers.get('content-type') || ''
      if (!res.ok || type.includes('text/html')) return
      const buf = await res.arrayBuffer()
      const face = new FontFace(family, buf, { display: 'swap' })
      await face.load()
      document.fonts.add(face)
    } catch (e) { /* font nahi mila — fallback chalega */ }
  })
}
