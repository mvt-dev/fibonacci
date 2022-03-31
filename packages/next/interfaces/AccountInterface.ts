export enum AccountType {
  Transaction = 'TRANSACTION',
  Credit = 'CREDIT',
  Investment = 'INVESTMENT',
}

export enum AccountCurrency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
}

export enum AccountCurrencySymbol {
  BRL = 'R$',
  USD = '$',
  EUR = '€',
}

export interface Account {
  id?: number;
  name: string;
  type: AccountType;
  currency: AccountCurrency;
  balance?: number;
};
