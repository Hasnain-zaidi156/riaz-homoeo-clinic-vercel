/* **text** ko bold dikhata hai (product description mein headings ke liye). Baqi text jaisa hai waisa. */
export const rich = s => String(s || '').split(/(\*\*[^*\n]+\*\*)/g).map((part, i) =>
  /^\*\*[^*\n]+\*\*$/.test(part) ? <strong key={i}>{part.slice(2, -2)}</strong> : part
)
