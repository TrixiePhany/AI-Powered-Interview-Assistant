import * as pdfjs from "pdfjs-dist";
import mammoth from "mammoth";
import { identitySchema } from "./schema";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs";

function extractFields(text: string) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = text.match(/(\+?\d[\d\s\-()]{7,})/)?.[0] || "";
  const firstLine = text.split("\n").map(s=>s.trim()).filter(Boolean)[0] || "";
  const name = firstLine.replace(/[^\p{L}\s'.-]/gu, "").slice(0,80);
  return { name, email, phone };
}

export async function parseResume(file: File) {
  const ext = file.name.toLowerCase().split(".").pop();
  let rawText = "";

  if (ext === "pdf") {
    const array = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data: array }).promise;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      rawText += content.items.map((it: any) => it.str).join(" ") + "\n";
    }
  } else if (ext === "docx") {
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    rawText = res.value;
  } else {
    throw new Error("Please upload PDF or DOCX file");
  }

  const candidate = extractFields(rawText);
  const parsed = identitySchema.safeParse(candidate);

  return {
    rawText,
    candidate,
    valid: parsed.success,
    missing: Object.keys(identitySchema.shape).filter(
      (k) => !(candidate as any)[k]
    ),
  };
}
