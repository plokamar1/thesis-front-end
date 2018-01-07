import {Injectable} from '@angular/core';
import base64url from 'base64url';
import {Subject} from "rxjs/Subject";
import {AuthenticationService} from "./authentication.service";

declare const FB: any;


@Injectable()
export class DataService {
    public userData;
    public uris;

    constructor() {
    }


    setData(data) {
        const that = this;
        //localStorage.setItem('userBasicInfo', JSON.stringify(data));
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
    checkIfConnected(provider: string) {
        const data = this.getData();
        if(data.user_accounts.length < 1) {
            return 0;
        }
        const Accounts = data.user_accounts.filter(x => x.provider === provider);
        return Accounts.length;
    }


}
