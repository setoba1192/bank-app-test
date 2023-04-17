import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicTransferPage } from './basic-transfer/basic-transfer.page';
import { QRGeneratorPage } from './qr-generation/qr-generator.page';
import { QRReader } from './qr-reader/qr-reader.page';


const routes: Routes = [
  {
    path: 'basic-transfer',
    component: BasicTransferPage,
  },
  {
    path: 'qr-viewer',
    component: QRGeneratorPage,
  },
  {
    path: 'qr-scanner',
    component: QRReader,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferRoutingModule {}
