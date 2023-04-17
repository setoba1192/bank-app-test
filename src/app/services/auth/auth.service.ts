import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Preferences } from '@capacitor/preferences';
import { delay, tap, map } from 'rxjs';
import { LoginResponse } from 'src/app/models/login-response.model';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    public jwtHelper: JwtHelperService,
    private sessionService: SessionService
  ) {}

  setSession(token: string) {
    Preferences.set({ key: 'token', value: token });
  }

  async getSession() {
    const { value } = await Preferences.get({ key: 'token' });
    try {
      return this.jwtHelper.isTokenExpired(value);
    } catch (error) {
      console.log('Token invalido');
      return false;
    }
  }

  // Sign in
  async signIn(email: string, password: string) {
    let requestLogin = {
      email: email,
      password: password,
    };

    return this.httpClient.get('./assets/accounts/login.json').pipe(
      delay(2500),
      map((data: LoginResponse) => {
        if (
          requestLogin.email == 'test@softcaribbean.com' &&
          requestLogin.password == '1234'
        ) {
          this.setSession(data.token);
          return data;
        }

        throw Error('Email or password not valid');
      })
    );
  }
  tokenValid(token: any) {
    const now = Date.now() / 1000;
    const expiry = token.created_at + token.expires_in;
    return now < expiry;
  }

  async signOut() {
    this.sessionService.clearAllData();
    this.router.navigateByUrl('/signin');
  }
}
