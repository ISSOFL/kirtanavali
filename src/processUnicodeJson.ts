import fs from 'fs';

const inFilePath = 'out/Kirtanavali_Guj_Unicode.json';
const outFilePath = 'out/Kirtanavali_Guj_Kirtans.json';

const gujNumChars = '૦૧૨૩૪૫૬૭૮૯'.split('');

async function main() {
  let pdfPages: string[][] = JSON.parse(fs.readFileSync(inFilePath, 'utf8'));

  pdfPages = cleanUpPagePrefixes(pdfPages);
  const kirtans = extractKirtans(pdfPages);

  fs.writeFileSync(outFilePath, JSON.stringify(kirtans, null, '  '));
}

function cleanUpPagePrefixes(pdfPages: string[][]): string[][] {
  const ignoreUptoRegex = /^([ટઇ]+|કિર્તનાવલી .*)$/;

  for (const lines of pdfPages) {
    let ignoreUpToIndex = -1;

    // find the last ignoreUpto match
    for (let i = 0; i < lines.length; ++i) {
      if (ignoreUptoRegex.test(lines[i])) {
        ignoreUpToIndex = i;
      }
    }

    if (ignoreUpToIndex !== -1) {
      lines.splice(0, ignoreUpToIndex + 1);
    }
  }

  return pdfPages;
}

function extractKirtans(pdfPages: string[][]): string[][] {
  const allLines = pdfPages.flat();
  let nextKirtanIdx = 0;
  const kirtanIndices: number[] = [];

  // get the start line indices for every kirtan
  for (let i = 0; i < allLines.length; ++i) {
    const gujNextKirtanIdx = numToGujNum(nextKirtanIdx);

    if (allLines[i].startsWith(`${gujNextKirtanIdx}.`)) {
      kirtanIndices.push(i);
      nextKirtanIdx++;
    }
  }

  kirtanIndices.push(allLines.length);

  const kirtans: string[][] = [];
  for (let i = 0; i < kirtanIndices.length - 1; ++i) {
    kirtans.push(allLines.slice(kirtanIndices[i], kirtanIndices[i + 1]));
  }

  return kirtans;
}

function numToGujNum(num: number) {
  return num
    .toString()
    .split('')
    .map((c) => gujNumChars[parseInt(c, 10)])
    .join('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
