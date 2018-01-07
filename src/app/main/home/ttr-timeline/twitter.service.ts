import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import {config} from '../../../config'
import { DataService } from "../../../data.service";
import { request } from 'https';
import { error } from 'util';

@Injectable()
export class TwitterService {

  constructor(private http:Http) { }
  twits=[];
  lastId = '';

  loading = true;
  getLastId(){
    if(this.twits.length){
      return this.twits[(this.twits.length-1)].id;      
    }
    return '';
  }

  getTwits(){
    console.log(this.lastId);
    if(this.twits.length == 0 || this.lastId == this.getLastId()){
      
      let request_url = config.ApiUrl.concat(config.getTwits,'?token=',localStorage.getItem('token'),'&max_id=', this.getLastId())
      const headers = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });
  
      this.http.get(request_url,{
        "headers": headers
      })
      .map((response: Response) => response.json())
      .catch(err => Observable.throw(err.json()))
      .subscribe(data=>{
        this.loading = false;
        console.log(data);
  
         if(this.twits.length){
           for(let twit of data){
             this.twits.push(twit);
           }
  
         }else{
           this.twits = data;
         }
         this.lastId = this.getLastId();
      },error=>{
        this.loading = false;
        
        console.log(error);
      });


    }
    
    
  }
}
