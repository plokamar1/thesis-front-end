import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../data.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
    userData: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
      console.log('Initializing account comp');
      let instance = this;
      this.dataService.getData()
          .then(function(response){
              instance.userData = response;
              console.log('got Data');
              console.log(instance.userData);
          });

      //this.userData = this.dataService.userData;
      //this.accounts = this.dataService.userData.user_accounts;
  }

}
