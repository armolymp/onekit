import assert from "node:assert/strict"
import { test } from "node:test"
import { PDFDocument } from "pdf-lib"
import { countPdfPages, mergePdfBytes, splitPdfBytes } from "../src/lib/pdf.ts"
import { parsePageRange } from "../src/lib/page-range.ts"

test("parsePageRange keeps order and expands ranges", () => {
  assert.deepEqual(parsePageRange("1-3, 5", 6), { pages: [0, 1, 2, 4] })
  assert.deepEqual(parsePageRange("4, 1-2", 4), { pages: [3, 0, 1] })
})

test("parsePageRange rejects bad input", () => {
  const empty = parsePageRange("  ", 3)
  assert.ok("error" in empty)
  const backwards = parsePageRange("4-2", 5)
  assert.ok("error" in backwards)
  const high = parsePageRange("9", 3)
  assert.ok("error" in high)
})

async function blankPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.addPage([220, 220])
  return doc.save()
}

test("merge and split round-trip page counts", async () => {
  const first = await blankPdf()
  const second = await blankPdf()
  const merged = await mergePdfBytes([first, second])
  assert.equal(await countPdfPages(merged), 2)
  const split = await splitPdfBytes(merged, [1])
  assert.equal(await countPdfPages(split), 1)
})
