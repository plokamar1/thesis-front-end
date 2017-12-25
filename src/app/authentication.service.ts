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
        const json_str = {'code': code, 'prov':prov};
        const json = JSON.stringify(json_str);
        return this.http.post(requestUrl,json,{
            'headers': headers
        })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()))
            .subscribe(data =>{
                console.log(data);
                this.dataService.setData(data)
                    .then(function(){
                        instance.router.navigateByUrl('main/home');
                    })
            },error=>{
                console.log(error);
                //instance.router.navigateByUrl('/auth/sign-in');
            });

    }

    get_URI() {
        let response: string;
        const requestUrl = 'http://127.0.0.1:5000/api/socialAuth'
        return this.http.get(requestUrl)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()))
   
    }


    TTRSignIn() {
        const settings = {
            oauth_consumer_key: 'a1ZK0tFm8wHBfN8eX4LYLsCqM',
            consumersecret: 'kiJVGJTypbhX0BkUgdfXpwVdzRHhq2Be0aHslTjL0v3UuMaRqF'
        };
        const header = settings.oauth_consumer_key + ':' + settings.consumersecret;


        this.http.post('https://api.twitter.com/oauth/request_token', header)
            .map((response: Response) => console.log(response))
            .catch((error: Response) => Observable.throw(error.json()));


    }

    // assign local storage data(tokens etc.)
    assignLocalData(data, logintype) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('loginType', logintype);
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
