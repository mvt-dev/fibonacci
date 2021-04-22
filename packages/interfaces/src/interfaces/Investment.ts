export interface Investment {
  asset: string;
  amount: number;
  average: number;
  value: number;
  variation: number | null;
  valorization: number | null;
  valorizationPercent: number | null;
  closePrice: number | null;
  previousPrice: number | null;
  currentValue: number | null;
  type: string | null;
  currency: string | null;
  profit: number | null;
  
};
