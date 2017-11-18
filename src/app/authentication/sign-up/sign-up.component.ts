import {Component, OnInit} from '@angular/core';
import {NgForm, FormGroup, FormControl, Validators} from "@angular/forms";

import {User} from "../../models/user.model"
import {AuthenticationService} from "../../authentication.service";
import {Router} from "@angular/router";
import {DataService} from "../../data.service";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['../sign-in/sign-in.component.css']
})
export class SignUpComponent implements OnInit {
    signUpForm: FormGroup;

    constructor(private authService: AuthenticationService,
                private router: Router,
                private dataService: DataService) {
        //authService.checkUserToken('user-profile');
    }

    ngOnInit() {
        this.signUpForm = new FormGroup({
            firstname: new FormControl(null, Validators.required),
            lastname: new FormControl(null, Validators.required),
            username: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }

    //onSubmit gives us the user info when he submits.
    onSignUp(form: NgForm) {
        let that = this;
        const callsUrl: string = 'https://api-storage.herokuapp.com/api/user';

        const user = new User(form.form.value.username,
            form.form.value.password,
            form.form.value.email,
            'FORM',
            form.form.value.firstname,
            form.form.value.lastname
        );
        console.log(user);
        this.authService.signUp(user, callsUrl)
            .subscribe(data => {
                that.dataService.setData(data).then(function(){
                    //here i save the token and the userId returned from the server
                    //to the local browser memory. This memory lasts for 2 hours
                    that.authService.assignLocalData(data, 'form');
                    that.router.navigateByUrl('/main/profile');
                });
                },
                error => {
                    console.error(error)
                }
            );
        //this.signUpForm.reset();
    }

    //onFBLogin attempts to log the user in facebook via the app. It should return some basic information for the user
    onFBLogin() {
        this.authService.FBSignIn();
    }

    onGGLLogin(){
        this.authService.GGLSignIn();
    }

}
