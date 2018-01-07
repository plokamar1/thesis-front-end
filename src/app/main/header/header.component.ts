import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../data.service';
import {AuthenticationService} from '../../authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
    userData: any;
    userFullname: string;

    constructor(private dataService: DataService,
                private authService: AuthenticationService,
                private router: Router) {
    }

    redirectTo(path: string) {
        this.router.navigateByUrl(path);
    }

    logout() {
        localStorage.clear()
        this.router.navigateByUrl('/auth/sign-in')
    }

    ngOnInit() {
        this.userData = this.dataService.getData();
        this.userFullname = this.userData.firstname;
           /* .then(function (response) {
                that.userData = response;
                that.userFullname = that.userData.firstname.concat(' ', that.userData.lastname);
            });*/
    }

}
