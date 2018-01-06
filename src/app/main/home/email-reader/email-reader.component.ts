import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';
import {AuthenticationService} from "../../../authentication.service";
import {ActivatedRoute, Params} from "@angular/router";
import {EmailService} from "./email.service";
import {MatSnackBar} from "@angular/material";

declare const gapi: any;

@Component({
    selector: 'app-email-reader',
    templateUrl: './email-reader.component.html',
    styleUrls: ['../rss-reader/rss-reader.component.css', './email-reader.component.css']
})
export class EmailReaderComponent implements OnInit, AfterViewInit {
    isConnected: boolean = true;
    scrollOptions = {axis: 'y', theme: 'minimal-dark', scrollButtons: {enable: true},scrollInertia: 0};
    scrollOptions2 = {axis: 'x', theme: 'minimal-dark', scrollButtons: {enable: true},scrollInertia: 0};
    containerHeight: string;
    trashArray = [];
    state :string;
    gglAuth: string;
    arrayNumbers = [];
    currentPage = 1;
    pageSize =30;

    constructor(private dataService: DataService,
                public emailService: EmailService,
                private authService: AuthenticationService,
                private route: ActivatedRoute,
                private snackBar: MatSnackBar) {

    }

    loadMore(){
        const pages =  Math.ceil(this.emailService.messagesList.length / this.pageSize);
        if(this.currentPage>=( pages-2) && this.emailService.nextPageToken){
            this.emailService.getMail(this.emailService.nextPageToken);
        }
    }


    onMoveToTrash() {
        const cssSnack = 'snack';
        this.emailService.toTrash(this.trashArray).subscribe(data => {
            // this.trashArray = [];
            this.emailService.getMail();
            this.snackBar.open(data.success, '', {duration: 2000,panelClass: cssSnack});
            for(let deleted of this.trashArray){
                const deletedItem = this.emailService.messagesList.find(x=> x.id === deleted.id);
                const index = this.emailService.messagesList.indexOf(deletedItem);
                this.emailService.messagesList.splice(index, 1);
            }
            this.trashArray = []
        },error => {
            console.log(error);
            this.trashArray = [];
            this.snackBar.open(error.error, '', {duration: 2000,panelClass: cssSnack});
        });

    }

    insertToTrashArray($event, mail) {
        if ($event.checked) {
            this.trashArray.push(mail.Id);
        } else {
            const updatedItem = this.trashArray.find(x => x === mail.Id);
            const index = this.trashArray.indexOf(updatedItem);
            console.log(index);
            this.trashArray.splice(index, 1);
        }
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
            this.state = 'mails'
            if(this.emailService.messagesList.length == 0){
                this.emailService.getMail();
            }
            
            //this.emailService.getMail();
        } else {
            this.authService.get_URI()
                .subscribe(data=>{
                    this.gglAuth = data.ggl_uri;
                },error=>{
                    this.gglAuth='';
                } ) ;
            this.state = 'notConnected';
            this.isConnected = false;
        }
    }
}
