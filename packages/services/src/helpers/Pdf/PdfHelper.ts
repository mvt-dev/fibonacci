import pdf from 'pdf-parse';

class PdfHelper {

  async parseToArrayOfPipes(pdfBuffer: Buffer): Promise<string[]> {
    const pdfData = await pdf(pdfBuffer, { pagerender: this.renderPage });
    return pdfData.text.split('\n').filter(x => x.trim() !== '');
  }

  private renderPage(pageData: any): string {
    return pageData.getTextContent({ disableCombineTextItems: true})
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

}

export default new PdfHelper();
