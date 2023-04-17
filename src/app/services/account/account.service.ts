import { Injectable } from '@angular/core';
import { UserAccount } from 'src/app/models/user-account.model';
import {
  Observable,
  BehaviorSubject,
  switchMap,
  of,
  from,
  map,
  firstValueFrom,
  delay
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SavingAccount } from 'src/app/models/saving-account.model';
import { CheckingAccount } from '../../models/checking-account.model';
import { Preferences } from '@capacitor/preferences';
import { TransferRequest } from 'src/app/models/account-transfer.model';
import { TransferResponse } from 'src/app/models/transfer-response';

@Injectable()
export class AccountService {
  private userAccount$ = new BehaviorSubject<UserAccount>(null);

  constructor(private httpClient: HttpClient) {}

  getUserAccounts(): Observable<UserAccount> {
    const _userAccount = this.getUserAccountFromStorage();
    return from(_userAccount).pipe(
      switchMap((data: any) => {
        if (!data) {
          return this.getUserAccountsFromApi();
        }
        return of(data);
      }),
      map((data: UserAccount) => {
        data.savingAccounts = data.savingAccounts.map(
          (a) => new SavingAccount(a.id, a.number, a.balance, a.currency)
        );
        data.checkingAccounts = data.checkingAccounts.map(
          (a) => new CheckingAccount(a.id, a.number, a.balance, a.currency)
        );
        return data;
      })
    );
  }

  /**
   * Method to send transfer to server
   */
  makeTransfer(transferRequest: TransferRequest): Observable<TransferResponse> {
    return this.httpClient
      .get<TransferResponse>(
        './assets/accounts/transfer-response.json')
      .pipe(
        /**
         * map to simulate dynamic response from server
         */
        map((response: TransferResponse) => {
          response.receivingAccount = transferRequest.receivingAccount;
          response.sentAmount = transferRequest.amountToTransfer;
          response.transaccionDate = new Date();
          response.status = 'OK';
          response.message = 'Transaction completed successfully'
          response.transaccionNumber = Math.floor(Math.random() * 1000000);
          return response;
        }),
        delay(3000)
      );
  }

  private getUserAccountsFromApi(): Observable<UserAccount> {
    return this.httpClient.get<UserAccount>('./assets/accounts/accounts.json');
  }

  private async getUserAccountFromStorage(): Promise<UserAccount> {
    try {
      const { value } = await Preferences.get({ key: 'userAccount' });
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  getUserAccounts$(): Observable<UserAccount> {
    return this.userAccount$.asObservable();
  }

  setUserAccount(userAccount: UserAccount) {
    Preferences.set({ key: 'userAccount', value: JSON.stringify(userAccount) });
  }

  async updateAmountSavingAccount(newBalance: number, accountNumber: string) {
    const _userAccount = await firstValueFrom(this.getUserAccounts());
    _userAccount.savingAccounts
      .find((s) => s.number == accountNumber)
      .updateBalance(newBalance);
    this.setUserAccount(_userAccount);
    this.userAccount$.next(_userAccount);
  }
  async updateAmountCheckingAccount(newBalance: number, accountNumber: string) {
    const _userAccount = await firstValueFrom(this.getUserAccounts());
    _userAccount.checkingAccounts
      .find((s) => s.number == accountNumber)
      .updateBalance(newBalance);
    this.setUserAccount(_userAccount);
    this.userAccount$.next(_userAccount);
  }
}
