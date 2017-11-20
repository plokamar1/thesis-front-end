import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from "../../data.service";
import {AuthenticationService} from "../../authentication.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
    userData: any;
    userFullname: string;
    background: string = 'none';

    constructor(private dataService: DataService,
                private authService: AuthenticationService) {
    }

    logout(){
        localStorage.clear()
        this.authService.checkUserToken();
    }

    ngOnInit() {
        const that = this;
        this.dataService.getData()
            .then(function (response) {
                that.userData = response;
                that.userFullname = that.userData.firstname.concat(' ', that.userData.lastname);
            });
    }

}
