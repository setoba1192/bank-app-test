import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { QRCodeService } from 'src/app/services/qr-code/qr-code.service';
import { Buffer } from 'buffer';
import { QRModel } from 'src/app/models/qr-data.model';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
  PlatformOptions,
} from 'capacitor-native-settings-joan';
import { SettingsType } from '../../weather/weather.page';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.page.html',
  styleUrls: ['./qr-reader.page.scss'],
})
export class QRReader implements OnInit, OnDestroy {
  permissionCameraGranted: boolean = false;
  constructor(
    private qrCodeService: QRCodeService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.startScan();
  }

  ngOnDestroy(): void {
    BarcodeScanner.stopScan();
  }

  goHome() {
    this.router.navigateByUrl('/account');
  }

  async startScan() {
    const { camera } = await Camera.requestPermissions();
    const { granted } = await BarcodeScanner.checkPermission();
    this.permissionCameraGranted = granted;

    if (!granted) {
      this.permissionCameraGranted = granted;
      return;
    }

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      const { content } = result;
      try {
        const data = JSON.parse(
          Buffer.from(content, 'base64').toString('utf-8')
        );
        if (!data.accountType) {
          throw Error('Could not read QR Code');
        }

        this.initTransfer(data);
      } catch (error) {
        this.presentAlert(
          'Error',
          '',
          'An error has ocurred reading QR Code, please try again'
        ).then(() => {
          this.startScan();
        });
      }
    }
  }

  cancel() {
    BarcodeScanner.stopScan();
    this.goHome();
  }

  async requestCameraPermissions() {
    this.openSettings(SettingsType.AppSettings).then(() => {
      this.startScan();
    });
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

  private openSettings(settingsType: SettingsType) {
    const platFormOptions = this.getSpecificOpenSettings(settingsType);
    return NativeSettings.open(platFormOptions);
  }

  private getSpecificOpenSettings(settingsType: SettingsType): PlatformOptions {
    if (settingsType == SettingsType.AppSettings) {
      return {
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      };
    }
    if (settingsType == SettingsType.LocationService) {
      return {
        optionAndroid: AndroidSettings.Location,
        optionIOS: IOSSettings.LocationServices,
      };
    }
  }

  private initTransfer(data: QRModel) {
    this.router.navigate(['/transfer/basic-transfer'], {
      state: { data: data },
    });
  }
}
