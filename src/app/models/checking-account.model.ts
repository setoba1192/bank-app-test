import { Account } from './account.model';

export class CheckingAccount extends Account {
  public updateBalance = (newBalance: number): void => {
    this.balance = newBalance;
  };
}
