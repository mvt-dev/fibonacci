export enum TransactionType {
  Investment = 'INVESTMENT',
  Whithdraw = 'WITHDRAW',
  Buy = 'BUY',
  Sell = 'SELL',
  Profit = 'PROFIT',
  Dividend = 'DIVIDEND',
  JCP = 'JCP',
  Fee = 'FEE',
  Emolumento = 'EMOLUMENTO',
  Rent = 'RENT',
  Adjustment = 'ADJUSTMENT',
  Gain = 'GAIN',
  Cost = 'COST',
  VirtualCost = 'VIRTUAL_COST'
}

export interface Transaction {
  id?: number;
  date: Date;
  account: number;
  type: TransactionType;
  category?: number;
  description: string;
  amount: number;
  value: number;
};
