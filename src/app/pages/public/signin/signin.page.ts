import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoginResponse } from 'src/app/models/login-response.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SessionService } from 'src/app/services/session/session.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  current_year: number = new Date().getFullYear();

  signinForm: FormGroup;
  submit_attempt: boolean = false;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Setup form
    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
    });
  }

  async signIn() {
    this.submit_attempt = true;

    if (
      this.signinForm.value.email == '' ||
      this.signinForm.value.password == ''
    ) {
      this.toastService.presentToast(
        'Error',
        'Please input email and password',
        'top',
        'danger',
        2000
      );
    } else {
      const loading = await this.loadingController.create({
        cssClass: 'default-loading',
        message: '<p>Signing in...</p><span>Please wait.</span>',
        spinner: 'crescent',
      });
      loading.present();

      (
        await this.authService.signIn(
          this.signinForm.value.email,
          this.signinForm.value.password
        )
      ).subscribe({
        complete: () => {
          loading.dismiss();
        },
        next: (data: LoginResponse) => {
          if (data.login) {
            this.sessionService.setSessionDuration(5);
            this.router.navigate(['/account']);
          }
        },
        error: (error) => {
          console.log(error);
          
          loading.dismiss();
          this.toastService.presentToast(
            'Error',
            error?.error ? 'An error occurred while sigin, please try again later' : error.message,
            'center',
            'danger',
            4000
          );
        },
      });
    }
  }
}
