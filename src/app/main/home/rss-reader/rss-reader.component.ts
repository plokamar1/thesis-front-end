import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RssReaderService} from './rss-reader.service';
import {Form} from '@angular/forms';
import { DataService } from 'app/data.service';

@Component({
    selector: 'app-rss-reader',
    templateUrl: './rss-reader.component.html',
    styleUrls: ['./rss-reader.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RssReaderComponent implements OnInit {
    hideSpinner = false;
    hideError = false;
    rssUrl: string;
    feedArray: any;
    mediaDescription: any;
    containerHeight: string;
    scrollOptions = {axis: 'y', theme: 'minimal-dark', scrollButtons: {enable: true},scrollInertia: 0};

    constructor(private rssService: RssReaderService,
                public dataService: DataService) {
        //this.containerHeight = (window.screen.height * 0.85) + 'px';
    }

    onResize($event){
        this.containerHeight = ($event.target.innerHeight * 0.85) + 'px';
    }
    receiveRss() {
        // enabling spinner
        this.hideSpinner = true;
        // disabling probably enabled error message
        this.hideError = false;
        // get the Json with RSS data
        this.rssService.getJson(this.rssUrl)
            .subscribe(data => {
                // upon receiving data we disable the spinner
                this.hideSpinner = false;
                if (data.status === 'ok') {
                    this.rssService.add_Rss(this.rssUrl);
                    this.mediaDescription = data.feed;
                    this.feedArray = data.items;
                }else if (data.status === 'error') {
                    this.hideError = true;
                }

            }, error => {
                console.error(error);
            });
    }

    ngOnInit() {
    }

}
