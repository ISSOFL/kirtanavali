import fs from 'fs';
import Sanscript from '@indic-transliteration/sanscript';

const inFilePath = 'out/Kirtanavali_Guj_Kirtans.json';
const outFilePath = 'out/Kirtanavali_Lipi_Kirtans.json';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const gujKirtans: string[][] = JSON.parse(fs.readFileSync(inFilePath, 'utf8'));
  const lipiKirtans = gujKirtans.map(gujToLipi);
  fs.writeFileSync(outFilePath, JSON.stringify(lipiKirtans, null, '  '));
}

function gujToLipi(gujLines: string[]): string[] {
  const lipiLines = gujLines.map(transliterate);
  return lipiLines;
  // const interleavedLines = interleaveArrays(lipiLines, gujLines);
  // return interleavedLines;
}

function transliterate(gujStr: string): string {
  let isoStr = Sanscript.t(gujStr, 'gujarati', 'iso');
  const replacements: Record<string, string> = {
    ṁ: 'ṅ', // ટં
    'm\u200c': 'ṁ', // મ્‌
    'n\u200c': 'ṅ', //
    ī: 'i',
    ś: 'sh',
    ē: 'e',
    ū: 'u',
    ō: 'o',
    ch: 'c̄', // છ
    c: 'ch', // ચ
    chch: 'cch', // ચ્ચે
    ḷ: 'ḏ', // ળ
    'd\u200c': 'ḋ', // દ્‌
    ṇ: 'ṉ', // ણ
    '\u2019': 'ḫ', // ના’વે
    'h\u200c': 'ḣ', // હ્‌
    jh: 'ʝ',
    '\u200c': '', // hidden character
  };

  for (const key in replacements) {
    // iterative replacement
    isoStr = isoStr.replaceAll(key, replacements[key]);
  }

  return isoStr;
}

function interleaveArrays<T>(arr1: T[], arr2: T[]): T[] {
  const result = [];
  const maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) {
      result.push(arr1[i]);
    }
    if (i < arr2.length) {
      result.push(arr2[i]);
    }
  }

  return result;
}
