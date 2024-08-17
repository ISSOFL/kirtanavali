import fs from 'fs';

const inFilePath = 'out/Kirtanavali_Lipi_Kirtans.json';
const outFilePath = 'out/Kirtanavali_Lipi_Algolia.json';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const lipiKirtans: string[][] = JSON.parse(fs.readFileSync(inFilePath, 'utf8'));
  const withTitleKirtans = lipiKirtans.map(parseKirtan);
  fs.writeFileSync(outFilePath, JSON.stringify(withTitleKirtans, null, '  '));
}

function parseKirtan(lines: string[], index: number): any {
  const title = lines[1].replaceAll('• ', '');
  return { title, lines, objectID: index };
}
