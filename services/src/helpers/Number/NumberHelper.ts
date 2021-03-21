class NumberHelper {

  parseBRL(number: string, decimal: number = 2): number | null {
    const toNumber = number.trim().replace(/\./g,' ').replace(',', '.');
    return +(Math.round(Number(toNumber + `e+${decimal}`))  + `e-${decimal}`);
  }

}

export default new NumberHelper();
