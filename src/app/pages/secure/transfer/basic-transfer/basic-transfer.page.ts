import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AccountType } from 'src/app/constants/account-type';
import { Account } from 'src/app/models/account.model';
import { UserAccount } from 'src/app/models/user-account.model';
import { AccountService } from 'src/app/services/account/account.service';
import Dinero from 'dinero.js';
import DineroFactory from 'dinero.js';
import { TransferRequest } from 'src/app/models/account-transfer.model';
import { TransferResponse } from 'src/app/models/transfer-response';
import { Router } from '@angular/router';
import { QRCodeService } from 'src/app/services/qr-code/qr-code.service';
import { QRModel } from 'src/app/models/qr-data.model';

@Component({
  selector: 'app-basic-transfer',
  templateUrl: './basic-transfer.page.html',
  styleUrls: ['./basic-transfer.page.scss'],
})
export class BasicTransferPage implements OnInit {
  transferForm: FormGroup;

  userAccount: UserAccount;
  qrGeneratorMode: boolean = false;
  private queryParams;
  readonly: boolean = false;

  /**
   * this data comes from API
   */
  exchanges = [
    {
      id: 1,
      name: 'COP',
    },
    {
      id: 2,
      name: 'USD',
    },
  ];

  constructor(
    private accountService: AccountService,
    private qrCodeService: QRCodeService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildTransferForm();
    this.getUserAccountsAndContinue();
    this.queryParams = this.router.getCurrentNavigation().extras.state;
    this.qrGeneratorMode = this.queryParams?.qrGeneratorMode;
  }

  private checkDataFromQR(data: QRModel) {
    if (data?.account) {
      this.readonly = true;
      this.transferForm.patchValue(data);
      this.transferForm.disable();
      if (!data.amount) {
        this.transferForm.controls.amount.enable();
      }
    }
  }

  private getUserAccountsAndContinue() {
    this.accountService.getUserAccounts().subscribe((data) => {
      this.userAccount = data;
      this.checkDataFromQR(this.queryParams?.data);
    });
  }

  private buildTransferForm() {
    this.transferForm = this.formBuilder.group({
      accountType: [null, [Validators.required]],
      account: [null, [Validators.required]],
      currency: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      receivingAccount: [null, [Validators.required, Validators.minLength(11)]],
    });
    if (this.qrGeneratorMode) {
      this.transferFormControls.amount.removeValidators(Validators.required);
    }
  }

  generateQRCode() {
    this.qrCodeService.setQrData(this.transferForm.getRawValue());
    this.router.navigate(['/transfer/qr-viewer']);
  }

  async transfer() {
    const transferFormValue = this.transferForm.getRawValue();
    const accountType = this.transferFormControls?.accountType.value;
    const currency = transferFormValue.currency.name;
    const accountNumber = transferFormValue.account.number;
    const amountToTransfer = Number(transferFormValue.amount + '00');

    const amountToSubtract = await this.convertToDefaultCurrency(
      Dinero({
        amount: amountToTransfer,
        currency: currency,
      }),
      accountNumber
    );

    const resultAmount = this.getResultAmount(amountToSubtract, accountNumber);

    if (accountType == AccountType[AccountType.SAVING]) {
      if (resultAmount < 0) {
        this.presentAlert('Warning', '', 'Insufficient funds');
        return;
      }
    }

    const transferRequest: TransferRequest = {
      accountNumber,
      amountToTransfer,
      currency: transferFormValue.currency,
      receivingAccount: transferFormValue.receivingAccount,
    };

    this.finalizeTransfer(transferRequest, accountType, resultAmount);
  }

  private updateAccountBalance(
    newBalance: number,
    accountNumber: string,
    accountType: string
  ) {
    if (accountType == AccountType[AccountType.SAVING]) {
      this.accountService.updateAmountSavingAccount(newBalance, accountNumber);
    }
    if (accountType == AccountType[AccountType.CHECKING]) {
      this.accountService.updateAmountCheckingAccount(
        newBalance,
        accountNumber
      );
    }
  }

  private async finalizeTransfer(
    transferRequest: TransferRequest,
    accountType: string,
    newBalance: number
  ) {
    const loading = await this.showLoading('Sending transaction, please wait');
    loading.present();
    this.accountService.makeTransfer(transferRequest).subscribe({
      complete: () => {
        loading.dismiss();
        this.updateAccountBalance(
          newBalance,
          transferRequest.accountNumber,
          accountType
        );
      },
      next: (data: TransferResponse) => {
        this.presentAlert(
          'Transaction',
          'Transaction : ' + data.transaccionNumber,
          data.message
        ).then(() => {
          this.router.navigate(['/account']);
        });
      },
      error: (error) => {
        loading.dismiss();
        this.presentAlert(
          'Error',
          '',
          'An error occurred while processing the transaction, please try again later'
        );
      },
    });
  }

  get transferFormControls() {
    return this.transferForm.controls;
  }

  private getResultAmount(
    amountToSubstract: DineroFactory.Dinero,
    accountNumber: string
  ): number {
    const account: Account = this.findAccount(accountNumber);
    const result = Dinero({
      amount: account.balance,
      currency: 'COP',
    }).subtract(amountToSubstract);

    return result.getAmount();
  }

  private convertToDefaultCurrency = async (
    amount: DineroFactory.Dinero,
    accountNumber: string
  ) => {
    const account: Account = this.findAccount(accountNumber);

    const rates = {
      rates: {
        COP: 4000,
      },
    };

    const currencyTarget: any = account.currency.name;

    /**
     * If tryig to conver same currency, return same.
     */
    if (amount.getCurrency().toString() == currencyTarget) {
      return amount;
    }

    return amount.convert(currencyTarget, {
      endpoint: new Promise((resolve) => resolve(rates)),
    });
  };

  private findAccount(accountNumber: string): Account {
    return [
      ...this.userAccount.savingAccounts,
      ...this.userAccount.checkingAccounts,
    ]
      .map((a: Account) => a)
      .find((a: Account) => a.number == accountNumber);
  }

  async presentAlert(title: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subHeader,
      message: message,
      keyboardClose: false,
      backdropDismiss: false,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Sending transaction, please wait',
      spinner: 'circles',
    });
    return loading;
  }

  cancel() {
    this.resetAll()
    console.log("pasa algo?");
    
    this.router.navigate(['/account']);
  }
  resetAll(){
    this.readonly = false;
    this.transferForm.reset();
  }
  /**
   * Method to match object in selects
   * @param val1
   * @param val2
   * @returns
   */
  compare(val1, val2) {
    return val1.id === val2.id;
  }
}
