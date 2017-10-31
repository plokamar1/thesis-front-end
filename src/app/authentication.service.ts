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
        console.log(body);

        return this.http.post(link, body)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    /*public signUp2(user, link: string) {
        const headers = new Headers({'Content-Type': 'application/json'});
        const body = JSON.stringify(user);
        console.log(body);

        return this.http.post(link, body).toPromise()
            .then((res:Response)=>{
            const body = res.json();
            return body;
            });
    }*/

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
                            /*instance.dataService.setData(fbuser);*/
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
                                        instance.dataService.setData(fbuser);
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
        const GoogleAuth = gapi.auth2.getAuthInstance();
        const signedIn = GoogleAuth.isSignedIn.get();
        console.log(signedIn);
        if (!signedIn) {
            GoogleAuth.signIn()
                .then((resolve, reject) => {
                    const userData = GoogleAuth.currentUser.get().getBasicProfile();
                    resolve(userData);
                })
                .then((userData) => {

                    const user = new GGLuser(userData.getEmail(), userData.ofa, userData.wea, userData.getId(), 'google', userData.getImageUrl());
                    console.log(user);
                });
        } else {
            const userData = GoogleAuth.currentUser.get().getBasicProfile();
            //console.log(userData.getImageUrl());

            const user = new GGLuser(userData.getEmail(), userData.ofa, userData.wea, userData.getId(), 'google', userData.getImageUrl());
            console.log(user);
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
