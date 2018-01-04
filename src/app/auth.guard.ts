import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { AuthenticationService } from './authentication.service'
import { DataService } from './data.service'
import { User } from './models/user.model'
import { error } from 'selenium-webdriver';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService,
    private dataService: DataService,
    private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if( this.authService.isAuthenticated()){
      return true;
    
    }

    this.router.navigateByUrl('/auth/sign-in');
    return false;
    
  }
}
