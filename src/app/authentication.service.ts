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

    FBSignIn() {
        let instance = this;
        let fbuser = new FBuser();
        let registerPromise = instance.FBGetLoginStatus();

        registerPromise
            .then(function (response: any) {
                console.log(response);
                if (response.status === "connected") {
                    localStorage.setItem('FBuserID', response.authResponse.userID);
                    localStorage.setItem('FBaccessToken', response.authResponse.accessToken);
                    //getting the user's data and passing it as a promise to next then
                    return new Promise(function (resolve) {
                        instance.FBData().then(function (apiResp) {
                            resolve(apiResp);
                        });
                    });
                } else {
                    instance.FBLogin()
                        .then(function (response: any) {
                        //making sure the user is connected
                        if (response.status === "connected") {
                            localStorage.setItem('FBuserID', response.userID);
                            localStorage.setItem('FBaccessToken', response.authResponse.accessToken);
                            //same passing the user's data as a promise to next then
                            return new Promise(function (resolve) {
                                instance.FBData().then(function (apiResp) {
                                    resolve(apiResp);
                                });
                            });
                        }
                    });
                }
            })
            .then(function (userRawdata: any) {
                //creating the object to send to the server
                fbuser = new FBuser(userRawdata.email,
                    userRawdata.first_name,
                    userRawdata.last_name,
                    userRawdata.short_name,
                    userRawdata.link,
                    userRawdata.verified,
                    userRawdata.id,
                    'facebook',
                    new CoverObject(null, null, null, null));
                //getting the photo of the user and passing the user object to next then
                return new Promise(function (resolve) {
                    const FBuserId = '/'.concat(localStorage.getItem('FBuserID'),'/picture');
                    FB.api(FBuserId, function (response: any) {
                        fbuser.cover.source = response.data.url;
                        resolve(fbuser);
                    });
                });
            })
            .then(function (fbuser) {
                //signing up the user
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
    FBLogout(){
        return new Promise(function (resolve) {
            FB.logout(function(response){
                resolve(response);
            })
        })
    }
    FBLogin(){
        return new Promise(function (resolve) {
            FB.login(function(response){
                resolve(response);
            }, {
                scope: 'public_profile,user_friends,email,pages_show_list,user_photos,user_posts',
                return_scopes: true
            });
        });
    }
    FBGetLoginStatus(){
        return new Promise(function (resolve) {
            FB.getLoginStatus(function(response){
                resolve(response);
            })
        });
    }

    FBData() {
        let FBuserID = localStorage.getItem('FBuserID');
        FBuserID = '/'.concat(FBuserID);
        //getting user's data
        return new Promise(function (resolve) {
            FB.api(FBuserID, 'get', {fields: "email,first_name,last_name,short_name,id,link,verified"}, function (response) {
                resolve(response);
            });
        });
    }
    GGLGetLoginStatus() {
        let GoogleAuth = gapi.auth2.getAuthInstance();
        return GoogleAuth.isSignedIn.get();
    }

    GGLLogin(){
        let GoogleAuth = gapi.auth2.getAuthInstance();
        return GoogleAuth.signIn();
    }

    GGLSignIn() {
        let that = this;
        let user = new GGLuser();
        let getUserInfoPromise;
        let GoogleAuth = gapi.auth2.getAuthInstance();

        if (!that.GGLGetLoginStatus()) {

            that.GGLLogin()
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
                            that.dataService.setData(data).then(function () {
                                //calling the function to save data to local storage
                                that.assignLocalData(data, 'google');
                                //transfer the user to main page
                                that.router.navigateByUrl('main/profile');
                            });
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

    //if there is no token the user isn't logged in. If he isn't and tries to enter the main site he gets redirected
    //back to the sign-in page
    checkUserToken(path ?: string) {
        if (localStorage.getItem('token')) {
            if (path) {
                this.router.navigateByUrl(path);
            }
        } else {
            this.router.navigateByUrl('auth/sign-in');
        }
    }


}
