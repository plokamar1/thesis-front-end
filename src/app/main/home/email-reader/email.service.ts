import { Injectable } from '@angular/core';
import { EmailModel } from "../../../models/email.model";
import base64url from "base64url";
import { DataService } from "../../../data.service";
import { FormGroup, NgForm } from "@angular/forms";
import { request } from 'https';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import {config} from '../../../config'

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

    sendMessage(f: NgForm) {
        const receivers = f.form.value.To;
        const headers = new Headers({ 'Content-Type': 'application/json' });
        
        const body = {
            "to": receivers,
            "subject": f.form.value.Subject,
            "body": f.form.value.Body,
        }
        const request_message = JSON.stringify(body);
        const request_url = config.ApiUrl.concat(config.sendMail,'?token=',localStorage.getItem('token')) 
        return this.http.post(request_url,request_message,{
            "headers": headers
        })
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()))
    }

    toTrash(emails) {
        const headers = new Headers({ 'Content-Type': 'application/json' });        
        const body = JSON.stringify({"messages": emails});
        const request_url = config.ApiUrl.concat(config.trashMails,'?token=',localStorage.getItem('token'));

        return this.http.post(request_url,body,{
            "headers": headers
        })
        .map((response: Response) => response.json())
        .catch((error: Response) => Observable.throw(error.json()))

    }


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
        }

    }

 
    filterHeaders(json: any, filter: string) {
        return json.result.payload.headers.filter(header => header.name === filter)[0].value;
    }


    decode(string) {
        return (base64url.decode(string.replace(/\-/g, '+').replace(/\_/g, '/')));
    }
    encode(string){
        return (base64url.encode(string))
    }
}
