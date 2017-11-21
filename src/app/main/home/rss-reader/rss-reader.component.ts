import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {RssReaderService} from "./rss-reader.service";

@Component({
  selector: 'app-rss-reader',
  templateUrl: './rss-reader.component.html',
  styleUrls: ['./rss-reader.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RssReaderComponent implements OnInit {

  constructor(private rssService: RssReaderService) { }

  getRss(){
     this.rssService.getJson()
         .subscribe(function (response) {
             console.log(response);
         });
  }
  ngOnInit() {
  }

}
