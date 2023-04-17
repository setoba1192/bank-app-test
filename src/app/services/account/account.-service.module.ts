import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from './account.service';
import { IonicStorageModule } from '@ionic/storage-angular';


@NgModule({
  imports: [
    CommonModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [],
  providers: [AccountService]
})
export class AccountServiceModule { }