import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {AuthenticationService} from "../../../authentication.service";
import {ActivatedRoute, Params} from "@angular/router";
import {EmailService} from "./email.service";
import {EmailModel} from "../../../models/email.model";
import {MatSnackBar} from "@angular/material";

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
                private route: ActivatedRoute,
                private snackBar: MatSnackBar) {
        this.containerHeight = (window.screen.height * 0.85) + 'px';
        console.log(this.trashArray)

    }

    onMoveToTrash() {
        this.emailService.toTrash(this.trashArray).then((counter) => {
            this.snackBar.open(counter + ' messages moved to Trash', '', {duration: 2000,});
        });

    }

    insertToTrashArray($event, mail: EmailModel) {
        if ($event.checked) {
            this.trashArray.push(mail);
        } else {
            const updatedItem = this.trashArray.find(x => x.Id === mail.Id);
            const index = this.trashArray.indexOf(updatedItem);
            console.log(index);
            this.trashArray.splice(index, 1);
        }
        console.log(this.trashArray);
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
