const numeric: any = {};

numeric.currency = (n: Number): string => {
  const num = n || 0;
  return num.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default numeric;
