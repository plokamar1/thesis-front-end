import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {AuthenticationService} from "../../../authentication.service";
import {ActivatedRoute, Params} from "@angular/router";
import {EmailService} from "./email.service";
import {EmailModel} from "../../../models/email.model";

@Component({
    selector: 'app-email-reader',
    templateUrl: './email-reader.component.html',
    styleUrls: ['../rss-reader/rss-reader.component.css', './email-reader.component.css']
})
export class EmailReaderComponent implements OnInit, AfterViewInit {
    isConnected: boolean = true;
    scrollOptions = {axis: 'y', theme: 'minimal-dark', scrollButtons: {enable: true}};
    scrollOptions2 = {axis: 'x', theme: 'minimal-dark', scrollButtons: {enable: true}};
    containerHeight: string;
    trashArray = [];

    constructor(private dataService: DataService,
                public emailService: EmailService,
                private authService: AuthenticationService,
                private route: ActivatedRoute) {
        this.containerHeight = (window.screen.height * 0.85) + 'px';


    }

    insertToTrashArray($event, mail: EmailModel) {
        if ($event.checked) {
            this.trashArray.push(mail);
        } else {
            const updatedItem = this.trashArray.find(x=>x.Id === mail.Id);
            const index = this.trashArray.indexOf(updatedItem);
            console.log(index);
            this.trashArray.splice(index,1);
        }
        console.log(this.trashArray);
    }

    onResize($event) {
        this.containerHeight = ($event.target.innerHeight * 0.85) + 'px';
    }

    show(mail: EmailModel) {
        console.log(mail.Subject);
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
