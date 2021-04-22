const numeric: any = {};

numeric.currency = (n: Number): string => n.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default numeric;
