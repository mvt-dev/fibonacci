export enum AccountType {
  Transaction = 'TRANSACTION',
  Credit = 'CREDIT',
  Investment = 'INVESTMENT',
}

export enum AccountCurrency {
  BRL = 'BRL',
  USD = 'USD',
}

export interface Account {
  id?: number;
  name: string;
  type: AccountType;
  currency: AccountCurrency;
};
