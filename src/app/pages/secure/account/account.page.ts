import { Component, OnInit } from '@angular/core';
import { default as Dinero, default as DineroFactory } from 'dinero.js';
import { Account } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account/account.service';
import { UserAccount } from '../../../models/user-account.model';
import { SessionService } from 'src/app/services/session/session.service';
import { Route, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  contentLoaded: boolean = false;

  userAccount: UserAccount;

  constructor(
    private accountService: AccountService,
    private sessionService: SessionService,
    private router: Router,
    private alertController : AlertController
  ) {}

  ngOnInit() {
    // Fake timeout

    this.getUserAccount();
    this.observeUserAccount();
    this.accountService.getUserAccounts$().subscribe((data) => {
      this.userAccount = data;
    });
  }

  private getUserAccount() {
    this.accountService.getUserAccounts().subscribe((data) => {
      this.userAccount = data;
      this.contentLoaded = true;
      this.accountService.setUserAccount(data);
    });
  }

  private observeUserAccount() {}

  currencyFormat(account: Account): string {
    let curr: DineroFactory.Currency = 'COP';
    if (account.currency.name == 'USD') {
      curr = 'USD';
    }

    return Dinero({ amount: account.balance, currency: curr }).toFormat(
      '0,0.00'
    );
  }

  private logout() {
    this.sessionService.clearAllData();
    this.router.navigateByUrl('signin');
  }

  async signOutAlert() {
    const alert = await this.alertController.create({
      header: 'Exit',
      message: '¿Are you sure to exit App?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }
}
