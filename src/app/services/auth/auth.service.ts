import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Preferences } from '@capacitor/preferences';
import { delay, tap } from 'rxjs';
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
      delay(4000),
      tap((data: LoginResponse) => {
        console.log('eeee', data);

        this.setSession(data.token);
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
