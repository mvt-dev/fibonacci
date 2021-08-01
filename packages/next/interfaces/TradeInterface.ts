export interface Trade {
  asset: string;
  currency: string;
  first: Date;
  last: Date;
  profit: number;
  buy: number;
  sell: number;
  result: number;
};
