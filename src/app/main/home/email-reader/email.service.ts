import { Injectable } from '@angular/core';
import { EmailModel } from "../../../models/email.model";
import base64url from "base64url";
import { DataService } from "../../../data.service";
import { FormGroup, NgForm } from "@angular/forms";
import { request } from 'https';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

declare const gapi: any;

@Injectable()
export class EmailService {
    private googleAccounts = [];
    private nextPageToken = '';
    public messagesList = [];
    public firstLoadFlag = true;
    private pageTokens = [];

    constructor(private dataService: DataService,
        private http: Http,
        private router: Router) {
    }

    onSend(f: NgForm) {
        console.log(f);
    }

    getMail() {
        const token = 'token='.concat(localStorage.getItem('token'))
        const request_url = 'http://127.0.0.1:5000/api/getmails?'.concat(token)

        this.http.get(request_url)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()))
            .subscribe(data => {
                this.messagesList = data.messages;
                this.pageTokens.push(data.nextPageToken);
                this.messagesList.sort((a, b) => {
                    if (a.Timestamp < b.Timestamp) return 1;
                    if (a.Timestamp > b.Timestamp) return -1;
                    return 0;
                });
            }, error => {
                this.router.navigateByUrl('/main/home');
            })


    }

    createMessage(f: NgForm) {
        const receivers = f.form.value.To.split(',');
        let message = [];
        message['to'] = receivers;
        message['subject'] = f.form.value.Subject;
        console.log(message);
    }

    toTrash(emails) {
        // const userData = this.dataService.getData();
        // const gglAccounts = userData.user_accounts[0].filter(x => x.provider === 'google');
        // let counter = 0;
        // return new Promise((resolve, reject) => {
        //     const request = gapi.client.gmail.users.messages.batchModify({
        //         'userId': gglAccounts[0].puid,
        //         'ids': emails,
        //         'addLabelIds': ['TRASH']
        //     });
        //     request.execute(response => {
        //         console.log(response);
        //         this.nextPageToken = '';
        //         this.messagesList = [];
        //         this.getMail('clicked');
        //         const str = emails.length.toString().concat(' messages were sent to trash!');
        //         if (response.result) resolve(str);
        //         if (response.error) reject('There was an error when moving the selected messages to trash');

        //     });


        // });

    }

    // getMail(clicked?: string) {
    //     if (this.firstLoadFlag) {
    //         this.emailHandler();
    //         this.firstLoadFlag = false;
    //     }
    //     if (clicked) this.emailHandler();
    // }

    emailModify(email, labelId: string) {
        if (email.Unread) {
            let request_url = 'http://127.0.0.1:5000/api/modifymails'.concat('?token=',localStorage.getItem('token'), '&action=remove&label=', labelId, '&id=', email.Id);
            console.log(request_url);
            this.http.get(request_url)
                .map((response: Response) => response.json())
                .catch((error: Response) => Observable.throw(error.json()))
                .subscribe(data=>{
                    console.log(data);
                },error=>{
                    console.log(error);
                })
            // const userData = this.dataService.getData();
            // const gglAccounts = userData.user_accounts[0].filter(x => x.provider === 'google');

            // const request = gapi.client.gmail.users.messages.modify(
            //     {
            //         'userId': gglAccounts[0].puid,
            //         'id': email.Id,
            //         "removeLabelIds": [
            //             labelId
            //         ]
            //     });
            // request.execute((response) => {
            //     console.log(response);
            // });
        }

    }

    // emailHandler() {
    //     //this.checkIfConnected('google');
    //     const data = this.dataService.getData();
    //     const gglAccounts = data.user_accounts[0].filter(x => x.provider === 'google');
    //     this.googleAccounts.push(gglAccounts);
    //     this.getMessagesIds(this.googleAccounts[0][0].puid)
    //         .then((messagesIdsResp) => {
    //             this.nextPageToken = messagesIdsResp.result.nextPageToken;
    //             if (messagesIdsResp.statusText === 'OK' && messagesIdsResp.result.resultSizeEstimate !== 0) {
    //                 this.getMessages(messagesIdsResp.result.messages, this.googleAccounts[0][0].puid);
    //             }
    //         });
    // }

    // getMessagesIds(userId: string) {
    //     return gapi.client.gmail.users.messages.list({
    //         'userId': userId,
    //         'labelIds': ['INBOX'],
    //         'maxResults': 25,
    //         'pageToken': this.nextPageToken,
    //         'q': 'category:primary'
    //     });
    // }

    // getMessages(messagesIds: any, userId: string) {
    //     for (let messageObj of messagesIds) {
    //         gapi.client.gmail.users.messages.get({
    //             'userId': userId,
    //             'id': messageObj.id,
    //             'format': 'full'
    //         }).then(messageResult => {
    //             let id = messageObj.id;
    //             let subject: string;
    //             let from: string;
    //             let body: string;
    //             let date: string;
    //             let unread: boolean;
    //             let timestamp = messageResult.result.internalDate;
    //             if (messageResult.result.labelIds.find(x => x === 'UNREAD')) {
    //                 //console.log();
    //                 unread = true;
    //             } else unread = false;
    //             let Email: EmailModel;
    //             subject = this.filterHeaders(messageResult, 'Subject');
    //             date = this.filterHeaders(messageResult, 'Date');
    //             from = this.filterHeaders(messageResult, 'From');
    //             if (messageResult.result.payload.body.size === 0) {
    //                 body = this.decode(messageResult.result.payload.parts[1].body.data);
    //                 Email = new EmailModel(subject, from, body, id, unread, timestamp, '', date);
    //                 this.messagesList.push(Email);
    //             } else {
    //                 body = this.decode(messageResult.result.payload.body.data);
    //                 Email = new EmailModel(subject, from, body, id, unread, timestamp, '', date);
    //                 this.messagesList.push(Email);
    //             }
    //             this.messagesList.sort((a, b) => {
    //                 if (a.Timestamp < b.Timestamp) return 1;
    //                 if (a.Timestamp > b.Timestamp) return -1;
    //                 return 0;
    //             });

    //         });

    //     }
    //     //this.messagesList.push(messageArrayConstruct);
    // }

    filterHeaders(json: any, filter: string) {
        return json.result.payload.headers.filter(header => header.name === filter)[0].value;
    }


    decode(string) {
        return (base64url.decode(string.replace(/\-/g, '+').replace(/\_/g, '/')));
    }
}
