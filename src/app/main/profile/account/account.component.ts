import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../data.service";
import {AuthenticationService} from "../../../authentication.service";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
    userData: any;
    accounts: any;

    constructor(private dataService: DataService,
                private authService: AuthenticationService) {
    }


    logOut(provider: string) {
        let that = this;
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
        let instance = this;
        this.dataService.getData()
            .then(function (response: any) {
                instance.userData = response;
                instance.accounts = response.user_accounts[0];
            });

        //this.userData = this.dataService.userData;
        //this.accounts = this.dataService.userData.user_accounts;
    }

}
