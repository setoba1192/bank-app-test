import { CheckingAccount } from './checking-account.model';
import { SavingAccount } from './saving-account.model';
export interface UserAccount {
  savingAccounts: SavingAccount[];
  checkingAccounts: CheckingAccount[];
}
