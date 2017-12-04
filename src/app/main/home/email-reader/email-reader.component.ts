import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {AuthenticationService} from "../../../authentication.service";
import {ActivatedRoute, Params} from "@angular/router";
import {EmailService} from "./email.service";

@Component({
    selector: 'app-email-reader',
    templateUrl: './email-reader.component.html',
    styleUrls: ['../rss-reader/rss-reader.component.css', './email-reader.component.css']
})
export class EmailReaderComponent implements OnInit,AfterViewInit {
    isConnected: boolean = true;
    scrollOptions = {axis: 'y', theme: 'minimal-dark', scrollButtons: {enable: true}};
    scrollOptions2 = {axis: 'x', theme: 'minimal-dark', scrollButtons: {enable: true}};
    containerHeight: string;

    constructor(private dataService: DataService,
                public emailService: EmailService,
                private authService: AuthenticationService,
                private route: ActivatedRoute) {
        this.containerHeight = (window.screen.height * 0.85) + 'px';


    }

    onResize($event) {
        this.containerHeight = ($event.target.innerHeight * 0.85) + 'px';
    }
    ngAfterViewInit() {
        if (this.dataService.checkIfConnected('google')) {
            this.emailService.getMail();
        } else {
            this.isConnected = false;
        }
    }

    ngOnInit() {

    }
}
