import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertController, Platform } from '@ionic/angular';
import { SessionService } from './services/session/session.service';
import { ToastService } from './services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private sessionService: SessionService,
    private toastService: ToastService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.startAppListener();
      if (Capacitor.getPlatform() !== 'web') {
      }

      setTimeout(async () => {
        await SplashScreen.hide();
      }, 2000);
    });
  }
  private startAppListener() {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.sessionService.isActiveSession().then((data) => {
          if (!data) {
            this.presentAlert(
              'Session',
              '',
              'Session has expired, please signin again'
            ).then(() => {
              this.router.navigateByUrl('/signin');
            });
            this.sessionService.clearAllData();
          }
        });
      }
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
}
