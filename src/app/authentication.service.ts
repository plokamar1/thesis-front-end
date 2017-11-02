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


    FBSignIn(onResponse) {
        const callsFBUrl = 'https://api-storage.herokuapp.com/api/user';
        let instance = this;
        let fbuser = new FBuser();
        //check login status. if connected then ask for user data. The user will be matched in the database by email
        //and user fb id
        FB.getLoginStatus(function (response) {
            console.log(response);
            //----------------->SIGN IN
            if (response.status === "connected") {
                console.log(response);
                localStorage.setItem('accessToken', response.authResponse.accessToken);
                //get the data of the user
                console.log('LOGGING IN');
                FB.api('/me', 'get', {fields: "email,first_name,last_name,short_name,id,link,verified"},
                    function (resp) {
                        fbuser = new FBuser(resp.email,
                            resp.first_name,
                            resp.last_name,
                            resp.short_name,
                            resp.link,
                            resp.verified,
                            resp.id,
                            'facebook',
                            new CoverObject(null, null, null, null));
                        FB.api('/me/picture', function (response) {
                            fbuser.cover.source = response.data.url;
                            onResponse(fbuser);
                        });
                    });
            } else {
                //--------------->SIGN UP
                //if the user isnt connected a pop up window appears and asks for authentication
                FB.login(function (response) {
                        if (response.status === "connected") {
                            //then the same happens and we produce the user model which will be sent to the database
                            FB.api('/me', 'get', {fields: "email,first_name,last_name,short_name,id,link,verified"},
                                function (resp) {
                                    fbuser = new FBuser(resp.email,
                                        resp.first_name,
                                        resp.last_name,
                                        resp.short_name,
                                        resp.link,
                                        resp.verified,
                                        resp.id,
                                        'facebook',
                                        new CoverObject(null, null, null, null));
                                    FB.api('/me/picture', function (response) {
                                        fbuser.cover.source = response.data.url;
                                        onResponse(fbuser);
                                    });
                                });
                        }
                    }, //these are the permissions we are asking the user to give us
                    {
                        scope: 'public_profile,user_friends,email,pages_show_list,user_photos,user_posts',
                        return_scopes: true
                    });
            }
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
                            that.assignLocalData(data);
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
                            //passing the data to the new component with the data service
                            that.dataService.userData = data;
                            //calling the function to save data to local storage
                            that.assignLocalData(data);
                            //transfer the user to main page
                            that.router.navigateByUrl('main/profile');
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


        this.http.post('https://api.twitter.com/oauth/access_token', header)
            .map((response: Response) => console.log(response))
            .catch((error: Response) => Observable.throw(error.json()));


    }

    //assign local storage data(tokens etc.)
    assignLocalData(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('loginType', 'google');
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
