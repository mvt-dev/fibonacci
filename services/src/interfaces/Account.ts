export enum ACCOUNT_TYPES {
  TRANSACTION = 'TRANSACTION',
  CREDIT = 'CREDIT',
  INVESTMENT = 'INVESTMENT',
};

export interface Account {
  id?: number;
  name: string;
  type: ACCOUNT_TYPES;
};
