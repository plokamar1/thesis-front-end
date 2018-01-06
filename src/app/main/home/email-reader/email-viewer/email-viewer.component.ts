import { Component, OnInit } from '@angular/core';
import { EmailService } from 'app/main/home/email-reader/email.service';

@Component({
  selector: 'app-email-viewer',
  templateUrl: './email-viewer.component.html',
  styleUrls: ['./email-viewer.component.css']
})
export class EmailViewerComponent implements OnInit {
  scrollOptions2 = {axis: 'x', theme: 'minimal-dark', scrollButtons: {enable: true},scrollInertia: 0};
  
  constructor(public emailService: EmailService) { }

  ngOnInit() {
  }

}
