export enum AccountType {
  Transaction = 'TRANSACTION',
  Credit = 'CREDIT',
  Investment = 'INVESTMENT',
}

export interface Account {
  id?: number;
  name: string;
  type: AccountType;
};
