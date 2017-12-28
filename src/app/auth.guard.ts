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
    // const token = localStorage.getItem('token')
    // const user = new User(token);
    // return this.authService.signIn(user, 'http://127.0.0.1:5000/api/user')
    //     .take(1)
    //     .do(data => {
    //       console.log('hello');
    //       if (data.error) {
    //         this.router.navigateByUrl('/auth/sign-in')
    //       }else{
    //         this.router.navigateByUrl('/main/home')
    //       }
    //     });

    // .subscribe(data => {
    //   this.dataService.setData(data);
    //   this.router.navigateByUrl('/main/home');
    // },error => {
    //   console.log('error');
    //   this.router.navigateByUrl('/auth/sign-in');
    // })
    // if (token){
    //   console.log('Iam in Here')

    //   const user = new User(token);
    //   this.authService.signIn(user, 'http://127.0.0.1:5000/api/user')
    //     .map((response: Response) => response.json())
    //     .catch((error: Response) => Observable.throw(error.json()))
    //     .subscribe(data => {
    //       this.dataService.setData(data);
    //       this.router.navigateByUrl('/main/home');
    //     },error => {
    //       console.log('error');
    //       this.router.navigateByUrl('/auth/sign-in');
    //     })

    // }else{
    //   return false;
    // }
  }
}
