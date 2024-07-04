export interface Product {
  id: number;
  imgUrl: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum PaymentMethodId {
  Cash = 'cash',
  Debit = 'debit',
  Credit = 'credit',
  Transfer = 'transfer',
  CashCredit = 'cash_credit',
  CashDebit = 'cash_debit',
  CashTransfer = 'cash_transfer',
}

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
}

export interface PaymentAmount {
  method: PaymentMethodId;
  amount: number;
}

export type LabelForPaymentMethod = {
  [K in PaymentMethodId]: string;
}

export interface LogPayment {
  cart: CartItem[];
  totalPayable: number;
  paymentMethods: PaymentAmount[];
  log: {
    date: Date;
  }
}