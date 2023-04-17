import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  async canActivate(): Promise<boolean> {

    const isSignedIn = !(await this.authService.getSession());   

    if (!isSignedIn) {
      this.router.navigate(['/signin']);
    }

    return isSignedIn;
  }
}