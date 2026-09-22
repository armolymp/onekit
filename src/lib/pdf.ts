import { PDFDocument } from "pdf-lib"

function readablePdfError(error: unknown): Error {
  const message = error instanceof Error ? error.message : ""
  if (/encrypt|password/i.test(message)) {
    return new Error("This PDF is password-protected. OneKit can't unlock it in the browser.")
  }
  return new Error(
    "This PDF couldn't be read. It may be damaged, or it uses a feature this browser tool doesn't support.",
  )
}

async function loadPdf(bytes: Uint8Array): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(bytes, { ignoreEncryption: true })
  } catch (error) {
    throw readablePdfError(error)
  }
}

export async function countPdfPages(bytes: Uint8Array): Promise<number> {
  const doc = await loadPdf(bytes)
  return doc.getPageCount()
}

export async function mergePdfBytes(inputs: Uint8Array[]): Promise<Uint8Array> {
  if (inputs.length < 2) throw new Error("Add at least two PDFs to merge.")
  const merged = await PDFDocument.create()
  for (const input of inputs) {
    const doc = await loadPdf(input)
    if (doc.getPageCount() === 0) continue
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach((page) => merged.addPage(page))
  }
  if (merged.getPageCount() === 0) throw new Error("Those PDFs don't contain any pages.")
  merged.setCreator("OneKit")
  merged.setProducer("OneKit")
  return merged.save({ useObjectStreams: true })
}

export async function splitPdfBytes(input: Uint8Array, pageIndexes: number[]): Promise<Uint8Array> {
  if (pageIndexes.length === 0) throw new Error("Pick at least one page.")
  const source = await loadPdf(input)
  const count = source.getPageCount()
  if (pageIndexes.some((index) => index < 0 || index >= count)) {
    throw new Error(`Pages must be between 1 and ${count}.`)
  }
  const next = await PDFDocument.create()
  const pages = await next.copyPages(source, pageIndexes)
  pages.forEach((page) => next.addPage(page))
  next.setCreator("OneKit")
  next.setProducer("OneKit")
  return next.save({ useObjectStreams: true })
}

export async function repackPdfBytes(input: Uint8Array): Promise<Uint8Array> {
  const doc = await loadPdf(input)
  doc.setCreator("OneKit")
  doc.setProducer("OneKit")
  return doc.save({ useObjectStreams: true, addDefaultPage: false })
}
