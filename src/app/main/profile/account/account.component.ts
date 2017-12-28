import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css', '../profile.component.css']
})
export class AccountComponent implements OnInit {
    userData: any;
    accounts: any;
    fa_Class: string;

    constructor(public dataService: DataService) {
    }

    // setIconClass(provider: string) {
    //     switch (provider) {
    //         case 'facebook':
    //             this.fa_Class = 'fa-facebook-official';

    //         case 'google':
    //             return '#EA4335';

    //         case 'twitter':
    //             return '#1DA1F2';

    //         case 'api':
    //             return '#7C4397';
    //     }
    // }

    // logOut(provider: string) {
    //     const that = this;
    //     switch (provider) {
    //         case 'facebook':
    //             this.authService.FBLogout().then(function (response) {
    //                 console.log(response);
    //                 that.authService.FBGetLoginStatus().then(function (response) {
    //                     console.log(response);
    //                 });
    //             });
    //     }
    // }

    ngOnInit() {

    }

}
