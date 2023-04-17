import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  // Select action
  async selectAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose an action',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Make a transfer',
          icon: 'swap-horizontal-outline',
          handler: () => {
            this.router.navigateByUrl('/transfer/basic-transfer');
          },
        },
        {
          text: 'Transfer using image',
          icon: 'camera-outline',
          handler: () => {
            this.router.navigate(['/transfer/qr-scanner']);
          },
        },
        {
          text: 'Generate QR Code',
          icon: 'qr-code-outline',
          handler: () => {
            this.router.navigateByUrl('/transfer/basic-transfer', {
              state: { qrGeneratorMode: true },
            });
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}
