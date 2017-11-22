import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {RssReaderService} from "./rss-reader.service";
import {Form} from "@angular/forms";

@Component({
  selector: 'app-rss-reader',
  templateUrl: './rss-reader.component.html',
  styleUrls: ['./rss-reader.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RssReaderComponent implements OnInit {
    private hideSpinner = false;
    private hideError = false;
    private rssUrl: string;
    private feedArray: any;
    private mediaDescription: any;
    private containerHeight: string;
    private scrollOptions =  { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } };

    constructor(private rssService: RssReaderService) {
      this.containerHeight = (window.screen.height * 0.85) + 'px';
    console.log(this.containerHeight);
  }
  receiveRss(){
      this.hideSpinner = true;
      this.hideError = false;
      this.rssService.getJson(this.rssUrl)
          .subscribe(data=> {
              this.hideSpinner=false;
              console.log(data);
              if(data.status === 'ok'){
                  this.mediaDescription = data.feed;
                  this.feedArray = data.items;
              }
              else if(data.status === 'error'){
                  this.hideError = true;
              }

          },error=>{
              console.error(error);
          });
  }

  ngOnInit() {
  }

}
