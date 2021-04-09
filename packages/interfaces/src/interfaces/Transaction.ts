export interface Transaction {
  id?: number;
  date: Date;
  account: number;
  category: number;
  description: string;
  amount: number;
  value: number;
};
