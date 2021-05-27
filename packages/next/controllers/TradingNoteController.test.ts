import fs from 'fs';
import path from 'path';
import TradingNoteController from './TradingNoteController';

describe('TradingNoteController', () => {

  test('Parse PDF to Ledger format', async () => {
    const tradingNoteController = new TradingNoteController();
    const pdfBuffer = fs.readFileSync(path.join(process.cwd(), 'mock', 'NotaNegociacao_522538_20210201.pdf'));
    const ledger = await tradingNoteController.parseNote(pdfBuffer);
    expect(ledger?.length).toBe(25);
    expect(ledger?.find(x => x.asset === 'IRRF')?.value).toBe(0.40);
    expect(ledger?.find(x => x.asset === 'REGISTRO')?.value).toBe(3.74);
    expect(ledger?.find(x => x.asset === 'EMOLUMENTO')?.value).toBe(1.76);
    const credit = ledger?.filter(x => x.type === 'CREDIT')?.reduce((acc, cur) => acc += cur.value || 0, 0);
    expect(credit).toBe(1335);
    const debit = ledger?.filter(x => x.type === 'DEBIT')?.reduce((acc, cur) => acc += cur.value || 0, 0);
    expect(debit).toBe(1294.90);
    expect(Math.round((credit - debit) * 100) / 100).toBe(40.10);
  });

});
