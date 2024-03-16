import fs from 'fs';
import PDFParser, { Output as PDFOutput } from 'pdf2json';

const pdfPath = 'pdfs/Kirtanavali_Guj_TOC.pdf';
const jsonPath = 'out/Kirtanavali_Guj.json';

async function main() {
  const parsedPdf = await readPdf(pdfPath);
  const lines = parsePages(parsedPdf);
  fs.writeFileSync(jsonPath, JSON.stringify(lines, null, '  '), 'utf8');
  console.log(`Parsed ${lines.length} pages`);
}

function readPdf(pdfFile: string): Promise<PDFOutput> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', (errMsg) => reject(new Error(errMsg)));
    pdfParser.on('pdfParser_dataReady', (pdfData) => resolve(pdfData));
    pdfParser.loadPDF(pdfFile);
  });
}

function parsePages(parsedPdf: PDFOutput): string[][] {
  const pages: string[][] = [];
  const pdfPages = parsedPdf.Pages;

  return pages;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
