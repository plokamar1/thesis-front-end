import {Injectable} from '@angular/core';

declare const FB: any;

@Injectable()
export class DataService {
    public userData;

    constructor() {
    }

    setData(data) {
        let instance = this;
        return new Promise(function (resolve) {
           resolve(instance.userData = data);
        });
  /*      console.log('got Data');
        this.userData = data;*/
    }

    getData() {
        console.log(this.userData);
        let instance = this;
        return new Promise(function (resolve) {
            resolve(instance.userData);
        })

    }
}
