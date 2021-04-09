export enum CategoryTag {
  Debit = 'DEBIT',
  Credit = 'CREDIT',
  Virtual = 'VIRTUAL',
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  tag: CategoryTag;
};
