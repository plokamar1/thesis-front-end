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
    private rssUrl: string;
    private hidden = false;
    private feedArray: any;
    private mediaDescription: any;
  constructor(private rssService: RssReaderService) {

  }
  receiveRss(){
      this.hidden = true;
      this.rssService.getJson(this.rssUrl)
          .subscribe(data=> {
              this.hidden=false;
              console.log(data);
              if(data.status === 'ok'){
                  this.mediaDescription = data.feed;
                  this.feedArray = data.items;
              }

          },error=>{
              console.error(error);
          });
  }

  ngOnInit() {
  }

}
