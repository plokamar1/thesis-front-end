import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {EmailService} from "../email.service";

@Component({
  selector: 'app-email-sender',
  templateUrl: './email-sender.component.html',
  styleUrls: ['./email-sender.component.css']
})
export class EmailSenderComponent implements OnInit {
    emailForm: FormGroup;
    public options: Object = {
        charCounterCount: true,
        toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
        toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
        toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
        height: 500,
    };


  constructor(public emailService: EmailService) {

  }


  ngOnInit() {
        this.emailForm = new FormGroup({
            To: new FormControl('',Validators.pattern('.+\@.+\..+')),
            Subject: new FormControl(''),
            Body: new FormControl(''),
        });
  }

}
