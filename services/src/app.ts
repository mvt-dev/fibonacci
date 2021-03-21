import fs from 'fs';
import path from 'path';
// import PdfReader from 'pdfreader';
import pdf from 'pdf-parse';

const pdfBuffer = fs.readFileSync(path.join(process.cwd(), 'mock', 'NotaNegociacao_522538_20210201.pdf'));

// var rows: any = {}; // indexed by y-position

// function printRows() {
//   Object.keys(rows) // => array of y-positions (type: float)
//     .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
//     .forEach((y) => console.log((rows[y] || []).join("")));
// }

// const pdfReader = new PdfReader.PdfReader();
// pdfReader.parseBuffer(pdfBuffer, (error: any, item: any) => {
//   if (!item || item.page) {
//     console.log(rows);
//     // end of file, or page
//     printRows();
//     console.log("PAGE:", item.page);
//     rows = {}; // clear rows for next page
//   } else if (item.text) {
//     // accumulate text items into rows object, per line
//     (rows[item.y] = rows[item.y] || []).push(item.text);
//   }
// });

// const nbCols = 9;
// const cellPadding = 40; // each cell is padded to fit 40 characters
// const columnQuantitizer = (item: any) => parseFloat(item.x) >= 20;

// const padColumns = (array: any, nb: number) =>
//   // Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
//   Array(nb).fill(null).map((val, i) => array[i] || []);
// // .. because map() skips undefined elements

// const mergeCells = (cells: any) =>
//   (cells || [])
//     .map((cell: any) => cell.text)
//     .join("") // merge cells
//     .substr(0, cellPadding)
//     .padEnd(cellPadding, " "); // padding

// const renderMatrix = (matrix: any) =>
//   (matrix || [])
//     .map((row: any, y: any) => padColumns(row, nbCols).map(mergeCells).join(" | "))
//     .join("\n");

// var table = new PdfReader.TableParser();

// const pdfReader = new PdfReader.PdfReader();
// pdfReader.parseBuffer(pdfBuffer, function (err: any, item: any) {
//   if (!item || item.page) {
//     // end of file, or page
//     console.log(renderMatrix(table.getMatrix()));
//     console.log("PAGE:", item.page);
//     table = new PdfReader.TableParser(); // new/clear table for next page
//   } else if (item.text) {
//     // accumulate text items into rows object, per line
//     table.processItem(item, columnQuantitizer(item));
//   }
// });

// default render callback
function render_page(pageData: any) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: false,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: true
  }

  return pageData.getTextContent(render_options)
    .then((textContent: any) => {
        let lastY, text = '';
        let lastX = 0;
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            if (lastX && item.transform[4] - lastX > 8) text += '|';
            text += item.str;
          }
          else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
          lastX = item.transform[4];
        }
        return text;
    });
}

pdf(pdfBuffer, { pagerender: render_page }).then((pdfData) => {
  const list = pdfData.text.split('\n').filter(x => x.trim() !== '');
  // console.log(list);
  const date = list[list.indexOf('Data pregão') + 1];
  const ledger = list
    .filter(x => x.startsWith('C|') || x.startsWith('V|'))
    .map(x => {
      const columns = x.split('|');
      const value = Number(columns[6].replace('.', '').replace(',', '.'));
      return {
        date,
        type: columns[0] === 'C' ? 'BUY' : 'SELL',
        asset: columns[1].replace(/ /g, ''),
        amount: Number(columns[3]),
        value: columns[0] === 'C' ? value * -1 : value
      }
    });
  ledger.push({
    date,
    type: 'FEE',
    asset: 'IRRF',
    amount: 1,
    value: Number(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[2].replace(',', '.'))
  });
  ledger.push({
    date,
    type: 'FEE',
    asset: 'REGISTRO',
    amount: 1,
    value: Number(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[4].replace(',', '.'))
  });
  ledger.push({
    date,
    type: 'FEE',
    asset: 'EMOLUMENTO',
    amount: 1,
    value: Number(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[5].replace(',', '.'))
  })
  // data.sell = list
  //   .filter(x => x.startsWith('V|WIN'))
  //   .reduce((acc, cur) => acc += cur.split('|')[6] ? Number(cur.split('|')[6].replace(',', '.')) : 0, 0);
  // data.amountGross = data.buy - data.sell;
  // data.feeIRRF = Number(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[2].replace(',', '.'));
  // data.feeRegistro = Number(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[4].replace(',', '.'));
  // data.feeEmolumentos = Number(list[list.findIndex(x => x.includes('IRRF Day Trade')) + 1].split('|')[5].replace(',', '.'));
  // data.amountNet = data.amountGross - data.feeIRRF - data.feeRegistro - data.feeEmolumentos;
  console.log(ledger);
});
