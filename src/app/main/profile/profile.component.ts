import {Component, OnInit} from '@angular/core';
import {DataService} from '../../data.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    userData: any;
    loading = true;
    userFirstName: string;
    userLastName: string;
    imgSrc: string;

    constructor( public dataService: DataService) {
        
    }

    ngOnInit() {
        //Check if the user has a photo in his account
        if(!this.dataService.userData.photo_url){
            this.dataService.userData.photo_url = 'https://www.1plusx.com/app/mu-plugins/all-in-one-seo-pack-pro/images/default-user-image.png';
        }
    }

}
