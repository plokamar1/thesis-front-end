import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {AuthenticationService} from "../../../authentication.service";
import {ActivatedRoute, Params} from "@angular/router";
import {EmailService} from "./email.service";
import {EmailModel} from "../../../models/email.model";
import {MatSnackBar} from "@angular/material";

declare const gapi: any;

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
    state :string;

    constructor(private dataService: DataService,
                public emailService: EmailService,
                private authService: AuthenticationService,
                private route: ActivatedRoute,
                private snackBar: MatSnackBar) {
        this.containerHeight = (window.screen.height * 0.85) + 'px';
        console.log(this.trashArray)

    }

    onMoveToTrash() {
        const cssSnack = 'snack';
        this.emailService.toTrash(this.trashArray).then((response: string) => {
            console.log(response);
            this.trashArray = [];
            this.snackBar.open(response, '', {duration: 2000,panelClass: cssSnack});
        }).catch(reason => {
            console.log(reason);
            this.trashArray = [];
            this.snackBar.open(reason, '', {duration: 2000,panelClass: cssSnack});
        });

    }

    insertToTrashArray($event, mail: EmailModel) {
        if ($event.checked) {
            this.trashArray.push(mail.Id);
        } else {
            const updatedItem = this.trashArray.find(x => x === mail.Id);
            const index = this.trashArray.indexOf(updatedItem);
            console.log(index);
            this.trashArray.splice(index, 1);
        }
        console.log(this.trashArray);
    }

    onChangeState(state: string){
        this.state = state;
    }

    onResize($event) {
        this.containerHeight = ($event.target.innerHeight * 0.85) + 'px';
    }

    ngAfterViewInit() {

    }

    ngOnInit() {
        if (this.dataService.checkIfConnected('google')) {
            this.state = 'viewer'
            //this.emailService.getMail();
        } else {
            this.state = 'notConnected';
            this.isConnected = false;
        }
    }
}
