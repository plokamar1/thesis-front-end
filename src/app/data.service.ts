import {Injectable} from '@angular/core';

declare const FB: any;

@Injectable()
export class DataService {
    public userData;

    constructor() {
    }

    setData(data) {
        let that = this;
        localStorage.setItem('userBasicInfo', JSON.stringify(data));
        return new Promise(function (resolve) {
            resolve(that.userData = data);
        });
        /*      console.log('got Data');
              this.userData = data;*/
    }

    getData() {
        let that = this;
        if(that.userData){
            return new Promise(function (resolve) {
                resolve(that.userData);
            })
        }else{
            return new Promise(function (resolve) {
                resolve( JSON.parse(localStorage.getItem('userBasicInfo') ) );
            })
        }


    }
}
