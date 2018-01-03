import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'

import { FBuser } from './models/FBuser.model';
import { CoverObject } from './models/cover.object';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { User } from './models/user.model';
import { GGLuser } from './models/GGLuser.model';
import { error } from 'util';
import { request } from 'http';


declare const FB: any;
declare const gapi: any;

@Injectable()
export class AuthenticationService {
    callsUrl = 'https://api-storage.herokuapp.com/api/user';
    public auth2: any;

    constructor(private http: Http,
        private router: Router,
        private dataService: DataService) {
    }

    public signUp(user, link: string) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Access-Control-Allow-Origin', '*')
        const body = JSON.stringify(user);
        return this.http.post('http://127.0.0.1:5000/api/user', body, {
            'headers': headers
        })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    public signIn(user, link: string) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        // producing the string of the call of the sign in
        const signInCallURL = link.concat('?username=', user.username, '&password=', user.password);
        return this.http.get(signInCallURL)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    postCode( code : string, prov: string){
        const headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Access-Control-Allow-Origin', '*')
        let instance = this;
        const requestUrl = 'http://127.0.0.1:5000/api/socialAuth';
        const token = localStorage.getItem('token');
        const json_str = {'code': code, 'prov':prov, 'token': token};
        const json = JSON.stringify(json_str);
        return this.http.post(requestUrl,json,{
            'headers': headers
        })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()))
            .subscribe(data =>{
                console.log(data);
                this.assignLocalData(data);
                this.router.navigateByUrl('main/home');
                // this.dataService.setData(data)
                //     .then(function(){
                //         instance.router.navigateByUrl('main/home');
                //     })
            },error=>{
                this.router.navigateByUrl('main/home');
                console.log(error);
                //instance.router.navigateByUrl('/auth/sign-in');
            });

    }
    isAuthenticated(){
        //const api_url = '127.0.0.1:5000/api/user'
        const token = localStorage.getItem('token');
        const d = new Date();
        const time = d.getTime();
        console.log(Number(localStorage.getItem('expires_at')));
        if( !token ){
            console.log('no token')
            return false;
        }
        if( Number(localStorage.getItem('expires_at')) < time ){
            console.log('expired')
            
            return false;
        }
        return true;
    }

    getUserData(){
        let requestUrl = 'http://127.0.0.1:5000/api/get-user';
        const token = localStorage.getItem('token');
        if ( token ){
            requestUrl = requestUrl.concat('?token=', token);
            return this.http.get(requestUrl)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()))
        }
    }

    get_URI() {
        let response: string;
        const requestUrl = 'http://127.0.0.1:5000/api/socialAuth'
        return this.http.get(requestUrl)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()))
   
    }

    // assign local storage data(tokens etc.)
    assignLocalData(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('expires_at', data.expires_at);
    }

    // if there is no token the user isn't logged in. If he isn't and tries to enter the main site he gets redirected
    // back to the sign-in page
    checkUserToken(path?: string) {
        const userToken = localStorage.getItem('token')
        const user = new User(userToken, '');
        if (localStorage.getItem('token')) {
            return this.signIn(user, 'http://127.0.0.1:5000/api/user')
                .subscribe(data => {
                    this.dataService.setData(data);
                    return true;
                },
                error => {
                    return false;
                })
        } else {
            return false;
        }
    }
}
