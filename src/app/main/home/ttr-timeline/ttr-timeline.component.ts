import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'app/data.service';
import { TwitterService } from 'app/main/home/ttr-timeline/twitter.service';
import { ActivatedRoute } from '@angular/router/src/router_state';

@Component({
  selector: 'app-ttr-timeline',
  templateUrl: './ttr-timeline.component.html',
  styleUrls: ['./ttr-timeline.component.css']
})
export class TtrTimelineComponent implements OnInit {
  onScroll($event){
    console.log($event);
  }



  private scrollOptions = { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true }, scrollInertia: 0 };
  state = 'viewer';
  ttrAuth = '';
  constructor(private dataService: DataService, public twitterService: TwitterService) { }
  ngOnInit() {
    
    if (this.dataService.checkIfConnected('twitter')) {
      this.twitterService.getTwits();
    }
    else{
      this.state = 'notConnected';
      this.ttrAuth = this.dataService.uris.ttr_uri;
    }

  }
}