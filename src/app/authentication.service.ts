import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx'

import {FBuser} from "./models/FBuser.model";
import {CoverObject} from "./models/cover.object";
import {Router} from "@angular/router";
import {DataService} from "./data.service";
import {User} from "./models/user.model";
import {GGLuser} from "./models/GGLuser.model";


declare const FB: any;
declare const gapi: any;

@Injectable()
export class AuthenticationService {
    callsUrl: string = 'https://api-storage.herokuapp.com/api/user';

    constructor(private http: Http,
                private router: Router,
                private dataService: DataService) {
    }

    public signUp(user, link: string) {
        const headers = new Headers({'Content-Type': 'application/json'});
        const body = JSON.stringify(user);
        return this.http.post(link, body)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    public signIn(user, link: string) {
        const headers = new Headers({'Content-Type': 'application/json'});
        //producing the string of the call of the sign in
        const signInCallURL = link.concat('/', user.username, '/', user.password);
        return this.http.get(signInCallURL)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    FBSign() {
        let userData: any;
        let instance = this;
        let fbuser = new FBuser();
        let getLoginStatus = new Promise(function (resolve) {
            FB.getLoginStatus(function (response) {
                resolve(response);
            })
        });

        getLoginStatus
            .then(function (response: any) {
                if (response.status === "connected") {
                    localStorage.setItem('accessToken', response.authResponse.accessToken);
                    return new Promise(function (resolve) {
                        instance.getFBData().then(function (apiResp) {
                            resolve(apiResp);
                        });
                    });
                } else {
                    FB.login(function (response: any) {
                        if (response.status === "connected") {
                            localStorage.setItem('accessToken', response.authResponse.accessToken);
                            return new Promise(function (resolve) {
                                instance.getFBData().then(function (apiResp) {
                                    resolve(apiResp);
                                });
                            });
                        }
                    }, {
                        scope: 'public_profile,user_friends,email,pages_show_list,user_photos,user_posts',
                        return_scopes: true
                    });
                }
            })
            .then(function (userRawdata: any) {
                fbuser = new FBuser(userRawdata.email,
                    userRawdata.first_name,
                    userRawdata.last_name,
                    userRawdata.short_name,
                    userRawdata.link,
                    userRawdata.verified,
                    userRawdata.id,
                    'facebook',
                    new CoverObject(null, null, null, null));
                return new Promise(function (resolve) {
                    FB.api('/me/picture', function (response: any) {
                        fbuser.cover.source = response.data.url;
                        resolve(fbuser);
                    });
                });
            })
            .then(function (fbuser) {
                instance.signUp(fbuser, instance.callsUrl)
                    .subscribe(data => {
                        //passing the data to the new component with the data service
                        instance.dataService.setData(data)
                            .then(function () {
                                //calling the function to save data to local storage
                                instance.assignLocalData(data, 'facebook');
                                //transfer the user to main page
                                instance.router.navigateByUrl('main/profile');
                            });
                    }, error => console.error(error));
            })
        ;
    }

    getFBData() {
        return new Promise(function (resolve) {
            FB.api('/me', 'get', {fields: "email,first_name,last_name,short_name,id,link,verified"}, function (response) {
                resolve(response);
            });
        });
    }

    GGLSignIn() {
        let that = this;
        let user = new GGLuser();
        let getUserInfoPromise;
        let GoogleAuth = gapi.auth2.getAuthInstance();
        let signedIn = GoogleAuth.isSignedIn.get();
        console.log(signedIn);

        if (!signedIn) {

            GoogleAuth.signIn()
            //Get the user's basic profile info
                .then(function () {
                    return new Promise(function (resolve) {
                        const userData = GoogleAuth.currentUser.get().getBasicProfile();
                        resolve(userData);
                    });
                })
                //construct the ggluser model and return it
                .then((userData) => {
                    const gglUser = new GGLuser(userData.getEmail(), userData.ofa, userData.wea, userData.getId(), 'google', userData.getImageUrl());
                    user = gglUser;
                    console.log(gglUser);

                    return user;
                })
                .then(function (user) {
                    //sign up the user to the back end
                    that.signUp(user, that.callsUrl)
                        .subscribe(data => {
                            //passing the data to the new component with the data service
                            that.dataService.userData = data;
                            //calling the function to save data to local storage
                            that.assignLocalData(data, 'google');
                            //transfer the user to main page
                            that.router.navigateByUrl('main/profile');
                        }, error => console.error(error));

                });
        } else {
            //Making a promise for getting user basic info
            getUserInfoPromise = new Promise(function (resolve) {
                resolve(GoogleAuth.currentUser.get().getBasicProfile());
            });
            //constructing the model of the gglUser
            getUserInfoPromise.then(function (userData) {
                user = new GGLuser(userData.getEmail(), userData.ofa, userData.wea, userData.getId(), 'google', userData.getImageUrl());
                return user;
            })
            //signing in the user to the back end and transferring him to main page
                .then(function (user) {
                    console.log(user);
                    that.signUp(user, that.callsUrl)
                        .subscribe(data => {
                            console.log(data);
                            //passing the data to the new component with the data service
                            that.dataService.setData(data)
                                .then(function () {
                                    //calling the function to save data to local storage
                                    that.assignLocalData(data, 'google');
                                    //transfer the user to main page
                                    that.router.navigateByUrl('main/profile');
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

    //assign local storage data(tokens etc.)
    assignLocalData(data, logintype) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('loginType', logintype);
    }


    checkUserToken(path: string) {
        if (localStorage.getItem('token')) {
            if (path) {
                this.router.navigateByUrl(path);
            }
        } else {
            this.router.navigateByUrl('auth/sign-in');
        }
    }


}
