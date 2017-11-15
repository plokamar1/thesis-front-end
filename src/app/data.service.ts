import {Injectable} from '@angular/core';

declare const FB: any;

@Injectable()
export class DataService {
    public userData;

    constructor() {
    }

    setData(data) {
        let that = this;
        return new Promise(function (resolve) {
            resolve(that.userData = data);
        });
        /*      console.log('got Data');
              this.userData = data;*/
    }

    getData() {
        let that = this;
        return new Promise(function (resolve) {
            resolve(that.userData);
        })

    }
}
