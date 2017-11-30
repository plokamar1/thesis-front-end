import {Injectable} from '@angular/core';
import base64url from 'base64url';
import {EmailModel} from "./models/email.model";
import {Subject} from "rxjs/Subject";
import {AuthenticationService} from "./authentication.service";

declare const FB: any;
declare const gapi: any;

@Injectable()
export class DataService {
    public userData;
    private googleAccounts = [];
    private nextPageToken = '';
    public messagesList = [];

    constructor() {
    }


    setData(data) {
        const that = this;
        localStorage.setItem('userBasicInfo', JSON.stringify(data));
        return new Promise(function (resolve) {
            resolve(that.userData = data);
        });

    }

    getData() {
        if (this.userData) {
            return this.userData
        } else {
            this.userData = JSON.parse(localStorage.getItem('userBasicInfo'));
            return this.userData;
        }
    }

    getMail() {
        this.emailHandler();
    }

    checkIfConnected(provider: string) {
        const data = this.getData();
        const gglAccounts = data.user_accounts[0].filter(x => x.provider === provider);
        return gglAccounts.length === 0;
    }

    emailHandler() {
        //this.checkIfConnected('google');
        const data = this.getData();
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
        let messageArrayConstruct = [];
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
                    messageArrayConstruct.push(Email);
                } else {
                    console.log('Normal');
                    body = this.decode(messageResult.result.payload.body.data);
                    Email = new EmailModel(subject, from, body, id, unread, timestamp, '', date);
                    messageArrayConstruct.push(Email);
                }
                messageArrayConstruct.sort((a, b) => {
                    if (a.Timestamp < b.Timestamp) return 1;
                    if (a.Timestamp > b.Timestamp) return -1;
                    return 0;
                });

            });
            this.messagesList= messageArrayConstruct;
        }

    }

    filterHeaders(json: any, filter: string) {
        return json.result.payload.headers.filter(header => header.name === filter)[0].value;
    }


    decode(string) {
        return (base64url.decode(string.replace(/\-/g, '+').replace(/\_/g, '/')));
    }
}
