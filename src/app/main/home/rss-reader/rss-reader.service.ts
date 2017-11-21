import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {encode} from "punycode";

@Injectable()
export class RssReaderService {

    constructor(private http: Http) {
    }

    getJson() {
        //the feed url gets escaped
        const url = encodeURIComponent('http://rss.cnn.com/rss/edition.rss');
        //we build the url to call
        const link = 'https://rss2json.com/api.json?rss_url='.concat(url);
        return this.http.get(link)
            .map((response: Response)=> response.json())
            .catch(err => Observable.throw(err.json()));
    }
}
