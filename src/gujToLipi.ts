import fs from 'fs';

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

function gujToLipi(lines: string[]): string[] {
  return lines;
}
