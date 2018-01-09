import { Component, OnInit, ViewEncapsulation,AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'app/authentication.service';
import {MatSnackBar} from "@angular/material";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit {

  constructor(private authService: AuthenticationService,
    private snackBar: MatSnackBar) { }

  ngAfterViewInit() {
    if(this.authService.error){
      const errorSnack = 'errorSnack';
      this.snackBar.open(this.authService.error.error, '', {duration: 2000,panelClass: errorSnack});
      this.authService.error = null;
    }

  }

}
