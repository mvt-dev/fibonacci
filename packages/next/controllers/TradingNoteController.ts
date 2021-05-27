import DateHelper from '../helpers/DateHelper';
import NumberHelper from '../helpers/NumberHelper';
import PdfHelper from '../helpers/PdfHelper';

const LEDGER_CREDIT = 'CREDIT';
const LEDGER_DEBIT = 'DEBIT';

/**
* Trading Note controller
*/
export default class TradingNoteController {

  /**
  * Parses trading note to ledger format
  * @param {Buffer} pdfBuffer PDF file
  * @returns {Ledger[]} Ledger
  */
  async parseNote(pdfBuffer: Buffer) {
    const list = await PdfHelper.parseToArrayOfPipes(pdfBuffer);
    const date = DateHelper.parseBRL(list[list.indexOf('Data pregão') + 1]);
    const ledger = list
      .filter(x => x.startsWith('C|') || x.startsWith('V|'))
      .map(x => {
        const columns = x.split('|');
        return {
          date,
          type: columns[7] === 'C' ? LEDGER_CREDIT : LEDGER_DEBIT,
          asset: columns[1].replace(/ /g, ''),
          amount: NumberHelper.parseBRL(columns[3], 0),
          value: NumberHelper.parseBRL(columns[6])
        }
      });
    ledger.push({
      date,
      type: LEDGER_DEBIT,
      asset: 'IRRF',
      amount: 1,
      value: NumberHelper.parseBRL(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[2])
    });
    ledger.push({
      date,
      type: LEDGER_DEBIT,
      asset: 'REGISTRO',
      amount: 1,
      value: NumberHelper.parseBRL(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[4])
    });
    ledger.push({
      date,
      type: LEDGER_DEBIT,
      asset: 'EMOLUMENTO',
      amount: 1,
      value: NumberHelper.parseBRL(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[5])
    });
    return ledger;
  }

}
