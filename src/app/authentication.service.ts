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

    public socialSignIn(link: string, accessToken?) {
        let requestUrl: string;
        if (accessToken) {
            requestUrl = link.concat('&token=', accessToken)
        } else {
            requestUrl = link;
        }
        return this.http.get(requestUrl)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    FBSignIn() {
        const instance = this;
        const registerPromise = this.FBGetLoginStatus();

        registerPromise
            .then(function (response: any) {
                console.log(response);
                if (response.status === 'connected') {
                    localStorage.setItem('FBuserID', response.authResponse.userID);
                    localStorage.setItem('FBaccessToken', response.authResponse.accessToken);
                    // getting the user's data and passing it as a promise to next then
                    instance.socialSignIn('http://127.0.0.1:5000/api/socialAuth?prov=fb', response.authResponse.accessToken)
                        .subscribe(data => {
                            // passing the data to the new component with the data service
                            instance.dataService.setData(data)
                                .then(function () {
                                    // calling the function to save data to local storage
                                    instance.assignLocalData(data, 'facebook');
                                    // transfer the user to main page
                                    instance.router.navigateByUrl('main/home');
                                });
                        }, error => console.error(error));
                } else {
                    instance.FBLogin()
                        .then(function (response: any) {
                            // making sure the user is connected
                            if (response.status === 'connected') {
                                localStorage.setItem('FBuserID', response.userID);
                                localStorage.setItem('FBaccessToken', response.authResponse.accessToken);
                                // same passing the user's data as a promise to next then
                                instance.socialSignIn('http://127.0.0.1:5000/api/socialAuth?prov=fb', response.authResponse.accessToken)
                                    .subscribe(data => {
                                        // passing the data to the new component with the data service
                                        instance.dataService.setData(data)
                                            .then(function () {
                                                // calling the function to save data to local storage
                                                instance.assignLocalData(data, 'facebook');
                                                // transfer the user to main page
                                                instance.router.navigateByUrl('main/home');
                                            });
                                    }, error => console.error(error));

                            }
                        });
                }
            })
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
                instance.router.navigateByUrl('/auth/sign-in');
            });

    }

    GGLLogin2() {
        let response: string;
        const requestUrl = 'http://127.0.0.1:5000/api/socialAuth?prov=ggl'
        return this.http.get(requestUrl)
            .map((response: Response) => response)
            .catch((error: Response) => Observable.throw(error))
   
    }


    FBLogout() {
        return new Promise(function (resolve) {
            FB.logout(function (response) {
                resolve(response);
            })
        })
    }

    FBLogin() {
        return new Promise(function (resolve) {
            FB.login(function (response) {
                resolve(response);
            }, {
                    scope: 'public_profile,user_friends,email,pages_show_list,user_photos,user_posts',
                    return_scopes: true
                });
        });
    }

    FBGetLoginStatus() {
        return new Promise(function (resolve) {
            FB.getLoginStatus(function (response) {
                resolve(response);
            })
        });
    }

    // 

    GGLGetLoginStatus() {
        const GoogleAuth = gapi.auth2.getAuthInstance();
        return GoogleAuth.isSignedIn.get();
    }

    GGLLogin() {
        const GoogleAuth = gapi.auth2.getAuthInstance();
        return GoogleAuth.signIn();
    }

    GGLSignIn() {
        const that = this;
        let user = new GGLuser();
        let getUserInfoPromise;
        const GoogleAuth = gapi.auth2.getAuthInstance();

        if (!that.GGLGetLoginStatus()) {

            that.GGLLogin()
                // Get the user's basic profile info
                .then(function () {
                    return new Promise(function (resolve) {
                        const userData = GoogleAuth.currentUser.get().getBasicProfile();
                        resolve(userData);
                    });
                })
                // construct the ggluser model and return it
                .then((userData) => {
                    const gglUser = new GGLuser(userData.getEmail(), userData.ofa, userData.wea, userData.getId(), 'google', userData.getImageUrl());
                    user = gglUser;
                    console.log(gglUser);

                    return user;
                })
                .then(function (user: GGLuser) {
                    // sign up the user to the back end
                    that.signUp(user, that.callsUrl)
                        .subscribe(data => {
                            // passing the data to the new component with the data service
                            that.dataService.setData(data).then(function () {
                                // calling the function to save data to local storage
                                that.assignLocalData(data, 'google');
                                // transfer the user to main page
                                that.router.navigateByUrl('main/home');
                            });
                        }, error => console.error(error));

                });
        } else {
            // Making a promise for getting user basic info
            getUserInfoPromise = new Promise(function (resolve) {
                resolve(GoogleAuth.currentUser.get().getBasicProfile());
            });
            // constructing the model of the gglUser
            getUserInfoPromise.then(function (userData) {
                user = new GGLuser(userData.getEmail(), userData.ofa, userData.wea, userData.getId(), 'google', userData.getImageUrl());
                return user;
            })
                // signing in the user to the back end and transferring him to main page
                .then(function (ggluser: GGLuser) {
                    console.log(ggluser);
                    that.signUp(ggluser, that.callsUrl)
                        .subscribe(data => {
                            console.log(data);
                            // passing the data to the new component with the data service
                            that.dataService.setData(data)
                                .then(function () {
                                    // calling the function to save data to local storage
                                    that.assignLocalData(data, 'google');
                                    // transfer the ggluser to main page
                                    that.router.navigateByUrl('main/home');
                                });
                        }, error => console.error(error));
                });
        }

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

    loadApis() {
        /*gapi.load('auth2', this.gapiInit);
        gapi.load('client', this.gapiClientInit);
        this.FBInit();*/
        Promise.all([gapi.load('auth2', this.gapiInit), gapi.load('client', this.gapiClientInit), this.FBInit()]).then(() => {
            return 'apis Loaded';
        })
    }

    private FBInit() {
        FB.init({
            appId: '752997224907283',
            cookie: true,
            xfbml: true,
            version: 'v2.10'
        }
        );
    }

    private gapiInit() {
        gapi.auth2.init({
            client_id: '448479229111-ogop287ptqs9fq6bia40kr7gh2lhg45b.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.metadata.readonly https://mail.google.com/'
        }).then(() => {
            console.log('Google Initiated');
        });
    }

    private gapiClientInit() {
        gapi.client.init({
            apiKey: 'AIzaSyB8y_U36Rq0UPBLVeS9Tjllq_hiO1gZta0',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            client_id: '448479229111-ogop287ptqs9fq6bia40kr7gh2lhg45b.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.metadata.readonly'

        }).then(() => {
            console.log('Gclient Initiated');
            this.gmailInit();
        });
    }

    private gmailInit() {
        gapi.client.load('gmail', 'v1', () => {
            console.log('gmail initiated');
        });
    }


}
