import fs from 'fs';
import PDFParser, { Output as PDFOutput } from 'pdf2json';

const pdfPath = 'pdfs/Kirtanavali_Guj.pdf';
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

  for (const pdfPage of pdfPages) {
    let lines: string[] = [];
    let words: string[] = [];

    let lastY = 0;
    for (const pdfText of pdfPage.Texts) {
      // add a new line if y changes
      if (lastY != pdfText.y) {
        if (lastY !== 0) {
          if (words.length) {
            lines.push(words.join(' '));
            words = [];
          }
        }
        lastY = pdfText.y;
      }

      for (const textRun of pdfText.R) {
        const word = decodeURIComponent(textRun.T);
        words.push(word);
      }
    }

    if (words.length) {
      lines.push(words.join(' '));
    }

    pages.push(lines);
    lines = [];
  }

  return pages;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
