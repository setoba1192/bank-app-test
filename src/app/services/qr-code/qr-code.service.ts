import { Injectable } from '@angular/core';
import { AccountType } from 'src/app/constants/account-type';
import { Account } from 'src/app/models/account.model';
import { QRModel } from 'src/app/models/qr-data.model';
import { SavingAccount } from 'src/app/models/saving-account.model';

@Injectable({
  providedIn: 'root',
})
export class QRCodeService {
  qrData: QRModel;

  constructor() {}

  setQrData(qrData: QRModel) {
    this.qrData = qrData;
    if (qrData.accountType == AccountType[AccountType.SAVING])
      this.qrData.account = new SavingAccount(
        qrData.account.id,
        qrData.account.number,
        qrData.account.balance,
        qrData.currency
      );
    if (qrData.accountType == AccountType[AccountType.CHECKING])
      this.qrData.account = new SavingAccount(
        qrData.account.id,
        qrData.account.number,
        qrData.account.balance,
        qrData.currency
      );
  }

  getQrData() {
    return this.qrData;
  }
}
