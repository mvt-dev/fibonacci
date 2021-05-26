export enum AssetType {
  StockBR = 'STOCK_BR',
  StockUS = 'STOCK_US',
  ReitBR = 'REIT_BR',
  FixedBR = 'FIXED_BR',
  Crypto = 'CRYPTO',
  Currency = 'CURRENCY',
}

export interface Asset {
  id?: number;
  name: string;
  symbol: string;
  type: AssetType;
  balance?: number;
  prices?: AssetPrice[];
  lastPrice?: Date | null;
};

export interface AssetPrice {
  id?: number;
  asset?: number;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  closeAdjusted?: number;
  volume?: number;
};
