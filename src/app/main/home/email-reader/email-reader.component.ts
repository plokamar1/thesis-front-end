import { Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {AuthenticationService} from "../../../authentication.service";

@Component({
    selector: 'app-email-reader',
    templateUrl: './email-reader.component.html',
    styleUrls: ['../rss-reader/rss-reader.component.css','./email-reader.component.css']
})
export class EmailReaderComponent {
    isConnected :boolean = true;
    scrollOptions = {axis: 'y', theme: 'minimal-dark', scrollButtons: {enable: true}};
    scrollOptions2 = {axis: 'x', theme: 'minimal-dark', scrollButtons: {enable: true}};
    containerHeight: string;
    emails = [];

    constructor(public dataService: DataService,
                private authService: AuthenticationService) {
        this.containerHeight = (window.screen.height * 0.85) + 'px';
    }
    showData(){
    }

    onResize($event) {
        this.containerHeight = ($event.target.innerHeight * 0.85) + 'px';
    }


}
