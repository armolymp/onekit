export type PageRangeResult = { pages: number[] } | { error: string }

export function parsePageRange(input: string, pageCount: number): PageRangeResult {
  const trimmed = input.trim()
  if (!trimmed) return { error: "Enter a page range, like 1-3, 5." }
  if (pageCount < 1) return { error: "This PDF has no pages." }

  const indices: number[] = []
  const seen = new Set<number>()

  for (const part of trimmed.split(",")) {
    const token = part.trim()
    if (!token) return { error: "There's an empty spot in the range." }

    const range = /^(\d+)\s*-\s*(\d+)$/.exec(token)
    const single = /^(\d+)$/.exec(token)

    if (range) {
      const start = Number(range[1])
      const end = Number(range[2])
      if (start < 1 || end < 1 || start > pageCount || end > pageCount) {
        return { error: `Pages must be between 1 and ${pageCount}.` }
      }
      if (start > end) return { error: `${token} goes backwards. Use a lower page first.` }
      for (let page = start; page <= end; page += 1) {
        if (!seen.has(page)) {
          seen.add(page)
          indices.push(page - 1)
        }
      }
      continue
    }

    if (single) {
      const page = Number(single[1])
      if (page < 1 || page > pageCount) {
        return { error: `Pages must be between 1 and ${pageCount}.` }
      }
      if (!seen.has(page)) {
        seen.add(page)
        indices.push(page - 1)
      }
      continue
    }

    return { error: `"${token}" isn't a page. Use numbers like 1-3 or 5.` }
  }

  if (indices.length === 0) return { error: "That range doesn't include any pages." }
  return { pages: indices }
}
