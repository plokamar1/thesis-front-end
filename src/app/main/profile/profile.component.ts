import {Component, OnInit} from '@angular/core';
import {Data, Router} from "@angular/router";
import {AuthenticationService} from "../../authentication.service";
import {DataService} from "../../data.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    userData : string;
    loading = true;
    userFirstName : string;
    userLastName : string;
    imgSrc: string ;

    constructor(private router: Router,
                private authService: AuthenticationService,
                private dataService: DataService) {
        this.imgSrc = 'https://www.1plusx.com/app/mu-plugins/all-in-one-seo-pack-pro/images/default-user-image.png';
        authService.checkUserToken(null);
        //this.userData = dataService.getData();
        //console.log(this.userData);
        //this.dataService.getFeed();
    }

    enableComp() {
        this.loading = false;
    }

    ngOnInit() {
        console.log('Profile initialised');
        this.userData  = this.dataService.userData;
        this.userLastName = this.dataService.userData.firstname;
        this.userLastName  = this.dataService.userData.lastname;
        /*    const userData = this.dataService.getData();
            console.log(userData);*/
    }

}
