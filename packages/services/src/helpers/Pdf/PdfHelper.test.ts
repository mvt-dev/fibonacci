import fs from 'fs';
import path from 'path';
import PdfHelper from './PdfHelper';

describe('PdfHelper', () => {

  test('Parse PDF to array of pipes "|"', async () => {
    const pdfBuffer = fs.readFileSync(path.join(process.cwd(), 'mock', 'NotaNegociacao_522538_20210201.pdf'));
    const parsedPdf = await PdfHelper.parseToArrayOfPipes(pdfBuffer);
    expect(parsedPdf.length).toBe(67);
    expect(parsedPdf.filter(x => x.startsWith('C|')).length).toBe(11);
    expect(parsedPdf.filter(x => x.startsWith('V|')).length).toBe(11);
  });

});
