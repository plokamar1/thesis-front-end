import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { DataService } from 'app/data.service';
import {config} from '../../../config'

@Injectable()
export class RssReaderService {

    constructor(private http: Http, private dataService: DataService) {
    }

    getJson(rssUrl: string) {
        // the feed url gets escaped

        const url = encodeURIComponent(rssUrl);
        // we build the url to call
        const link = 'https://rss2json.com/api.json?rss_url='.concat(url);
        return this.http.get(link)
            .map((response: Response) => response.json())
            .catch(err => Observable.throw(err.json()));
    }

    add_Rss(rssUrl: string){
        const token = 'token='.concat(localStorage.getItem('token'));
        const action = 'action=add';
        const rss = 'rss='.concat(rssUrl);
        const request_url = config.ApiUrl.concat(config.modifyRss,'?',token,'&',action,'&',rss)
        this.http.get(request_url)
            .map((response: Response) => response.json())
            .catch(err => Observable.throw(err.json()))
            .subscribe(data=>{
                this.dataService.userData.rss_feeds = data.rss_feeds;
            })


    }
}
