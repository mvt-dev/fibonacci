export const LEDGER_CREDIT = 'CREDIT';
export const LEDGER_DEBIT = 'DEBIT';

export interface Ledger {
  id?: number;
  date: Date | null;
  asset: string;
  type: typeof LEDGER_CREDIT | typeof LEDGER_DEBIT | string;
  amount: number | null;
  value: number | null;
};
