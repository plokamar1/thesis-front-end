import {Injectable} from '@angular/core';

declare const FB: any;

@Injectable()
export class DataService {
    public userData;

    constructor() {
    }

    setData(data) {
        console.log('got Data');
        this.userData = data;
    }

    getData() {
        if (this.userData) {
            return this.userData;
        }
    }
}
