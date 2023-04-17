import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from '../services/auth/auth.service'

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  async canActivate(): Promise<boolean> {
    
    const isSignedIn = !(await this.authService.getSession());

    if (isSignedIn) {
      this.router.navigate(['/account']);
    }

    return !isSignedIn;
  }
}
