import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from 'src/app/services/account/account.service';
import { AccountServiceModule } from 'src/app/services/account/account.-service.module';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    AccountPageRoutingModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
