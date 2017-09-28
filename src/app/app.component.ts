import {AfterViewInit, Component} from '@angular/core';

declare const FB: any;
declare const gapi: any;

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit{
    public auth2: any;

    constructor() {
        //fb.init should start right away. The appId and the version aren't optional
        FB.init({
                appId: '752997224907283',
                cookie: true,
                xfbml: true,
                version: 'v2.10'
            }
        );

    }
    public googleInit(){
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '448479229111-ogop287ptqs9fq6bia40kr7gh2lhg45b.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            });
        });
        console.log('Google Initiated');
    }

    ngAfterViewInit(){
        this.googleInit();
    }
}

