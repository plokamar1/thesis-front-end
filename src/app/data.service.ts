import {Injectable} from '@angular/core';

declare const FB: any;

@Injectable()
export class DataService {
    public userData;

    constructor() {
    }

    setData(data) {
        const that = this;
        localStorage.setItem('userBasicInfo', JSON.stringify(data));
        return new Promise(function (resolve) {
            resolve(that.userData = data);
        });
        /*      console.log('got Data');
              this.userData = data;*/
    }

    getData() {
        if (this.userData) {
            return this.userData
        } else {
            this.userData = JSON.parse(localStorage.getItem('userBasicInfo'));
            return this.userData;
        }
    }


    }
}
