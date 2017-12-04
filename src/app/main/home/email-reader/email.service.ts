import { Injectable } from '@angular/core';
import {EmailModel} from "../../../models/email.model";
import base64url from "base64url";
import {DataService} from "../../../data.service";

declare const gapi: any;
@Injectable()
export class EmailService {
    private googleAccounts = [];
    private nextPageToken = '';
    public messagesList = [];
  constructor(private dataService: DataService) { }

    getMail() {
        this.emailHandler();
    }

    emailHandler() {
        //this.checkIfConnected('google');
        const data = this.dataService.getData();
        const gglAccounts = data.user_accounts[0].filter(x => x.provider === 'google');
        this.googleAccounts.push(gglAccounts);
        this.getMessagesIds(this.googleAccounts[0][0].puid)
            .then((messagesIdsResp) => {
                this.nextPageToken = messagesIdsResp.result.nextPageToken;
                if (messagesIdsResp.statusText === 'OK' && messagesIdsResp.result.resultSizeEstimate !== 0) {
                    this.getMessages(messagesIdsResp.result.messages, this.googleAccounts[0][0].puid);
                }
            });
    }

    getMessagesIds(userId: string) {
        return gapi.client.gmail.users.messages.list({
            'userId': userId,
            'labelIds': ['INBOX'],
            'maxResults': 25,
            'pageToken': this.nextPageToken,
            'q': 'category:primary'
        });
    }

    getMessages(messagesIds: any, userId: string) {
        for(let messageObj of messagesIds){
            gapi.client.gmail.users.messages.get({
                'userId': userId,
                'id': messageObj.id,
                'format': 'full'
            }).then(messageResult => {
                let id = messageObj.id;
                let subject: string;
                let from: string;
                let body: string;
                let date: string;
                let unread: boolean;
                let timestamp = messageResult.result.internalDate;
                if (messageResult.result.labelIds.find(x => x === 'UNREAD')) {
                    //console.log();
                    unread = true;
                } else unread = false;
                let Email: EmailModel;
                subject = this.filterHeaders(messageResult, 'Subject');
                date = this.filterHeaders(messageResult, 'Date');
                from = this.filterHeaders(messageResult, 'From');
                if (messageResult.result.payload.body.size === 0) {
                    console.log('Mime');
                    body = this.decode(messageResult.result.payload.parts[1].body.data);
                    Email = new EmailModel(subject, from, body, id, unread, timestamp, '', date);
                    this.messagesList.push(Email);
                } else {
                    console.log('Normal');
                    body = this.decode(messageResult.result.payload.body.data);
                    Email = new EmailModel(subject, from, body, id, unread, timestamp, '', date);
                    this.messagesList.push(Email);
                }
                this.messagesList.sort((a, b) => {
                    if (a.Timestamp < b.Timestamp) return 1;
                    if (a.Timestamp > b.Timestamp) return -1;
                    return 0;
                });

            });

        }
        //this.messagesList.push(messageArrayConstruct);
    }

    filterHeaders(json: any, filter: string) {
        return json.result.payload.headers.filter(header => header.name === filter)[0].value;
    }


    decode(string) {
        return (base64url.decode(string.replace(/\-/g, '+').replace(/\_/g, '/')));
    }
}
