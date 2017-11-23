import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {AuthenticationService} from '../../../authentication.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css', '../profile.component.css']
})
export class AccountComponent implements OnInit {
    userData: any;
    accounts: any;

    constructor(private dataService: DataService,
                private authService: AuthenticationService) {
    }

    setBackground(provider: string) {
        switch (provider) {
            case 'facebook':
                return '#4267B2';

            case 'google':
                return '#EA4335';

            case 'twitter':
                return '#1DA1F2';

            case 'api':
                return '#7C4397';
        }
    }

    logOut(provider: string) {
        const that = this;
        switch (provider) {
            case 'facebook':
                this.authService.FBLogout().then(function (response) {
                    console.log(response);
                    that.authService.FBGetLoginStatus().then(function (response) {
                        console.log(response);
                    });
                });
        }
    }

    ngOnInit() {
        console.log('Initializing account comp');
        const that = this;
        this.dataService.getData()
            .then(function (response: any) {
                that.userData = response;
                that.accounts = response.user_accounts[0];
            });

    }

}
