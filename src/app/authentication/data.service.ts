import { Injectable } from '@angular/core';
declare const FB: any;

@Injectable()
export class DataService {
    private userData;

  constructor() { }

  setData(data){
      this.userData = data;
  }
  getData(){
      return this.userData;
  }
  getFeed(){
    /*  FB.api('/533986046969837/feed',function (response) {
          console.log(response);
      });*/   FB.api('/me/feed',function (response) {
          console.log(response);
      });
  }
}
