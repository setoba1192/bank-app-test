import { Dinero } from 'dinero.js';

export abstract class Account {
  id: number;
  number: string;
  balance: number;
  currency: Currency;

  constructor(id: number, number: string, balance: number, currency : Currency) {
    this.id = id;
    this.number = number;
    this.balance = balance;
    this.currency = currency;
  }

  getBalance(): number {
    return this.balance;
  }

  updateBalance: (newBalance : number) => void;
}

export interface Currency {
  id: number;
  name: string;
}
