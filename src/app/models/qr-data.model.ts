import { Account, Currency } from './account.model';

export interface QRModel {
  accountType: string;
  account: Account;
  currency: Currency;
  amount?: number;
  receivingAccount: string;
}
