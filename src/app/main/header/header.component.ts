import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {DataService} from "../../data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
    userData: any;
    userFullname: string;
  constructor( private dataService: DataService) { }

  ngOnInit() {
      const that = this;
      this.dataService.getData()
          .then(function(response){
              that.userData = response;
              that.userFullname = that.userData.firstname.concat(' ', that.userData.lastname);
          });
  }

}
