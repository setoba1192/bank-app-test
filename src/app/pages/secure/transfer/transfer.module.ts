import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferRoutingModule } from './transfer-routing.module';
import { BasicTransferPage } from './basic-transfer/basic-transfer.page';
import { NumberDirective } from 'src/app/directives/number-only.directive';
import { HttpClientModule } from '@angular/common/http';
import { QRGeneratorPage } from './qr-generation/qr-generator.page';
import { QRCodeService } from 'src/app/services/qr-code/qr-code.service';
import { QRCodeModule } from 'angularx-qrcode';
import { QRReader } from './qr-reader/qr-reader.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    TransferRoutingModule,
    QRCodeModule
  ],
  declarations: [BasicTransferPage, QRGeneratorPage, QRReader, NumberDirective],
  exports: [NumberDirective],
  providers : [QRCodeService]
})
export class TransferModule {}
