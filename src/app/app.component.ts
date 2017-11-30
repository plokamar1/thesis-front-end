import {AfterViewInit, Component} from '@angular/core';
import {AuthenticationService} from "./authentication.service";

declare const FB: any;
declare const gapi: any;

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    public auth2: any;

    constructor(private authService: AuthenticationService) {
        authService.loadApis();
        // fb.init should start right away. The appId and the version aren't optional


    }

    public googleInit() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: '448479229111-ogop287ptqs9fq6bia40kr7gh2lhg45b.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.metadata.readonly'
            });
            console.log('Google Initiated');
        });
    }

    ngAfterViewInit() {
        //this.googleInit();
    }
}

