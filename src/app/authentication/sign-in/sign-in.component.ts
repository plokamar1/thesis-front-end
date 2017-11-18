import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../authentication.service"
import {User} from "../../models/user.model";
import {DataService} from "../../data.service";


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {

    signInForm: FormGroup;
    wrongInput = false;
    noAccount = false;

    constructor(private authService: AuthenticationService,
                private router: Router,
                private dataService: DataService) {
        //checking the status of the user. If he is logged in continue
        //authService.checkUserToken('/user-profile');
    }

    ngOnInit() {
        //onInit i declare and create the formgroup object which has the characteristics
        //of the form elements.
        this.signInForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            /*email: new FormControl(null,[
                Validators.required,
                Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])")
            ]),//the email is not optional though it has to be written according to this REGEX*/
            password: new FormControl(null, Validators.required)
        });

    }

    onSignIn(form) {
        const that = this;
        const callsUrl: string = 'https://api-storage.herokuapp.com/api/user';
        const user = new User(form.value.username, form.value.password);
        this.authService.signIn(user, callsUrl)
            .subscribe(
                data => {
                    switch (data.message) {
                        case "succesfully logged in":
                            console.log('correct pass');
                            this.dataService.setData(data).then(function () {
                                that.authService.assignLocalData(data, 'form');
                                that.router.navigateByUrl('main/profile');
                            });
                            //here i save the token and the userId returned from the server
                            //to the local browser memory. This memory lasts for 2 hours
                            break;
                        case 'Wrong Password':
                            this.wrongInput = true;
                            this.noAccount = false;
                            break;

                    }
                }, error =>{
                    switch (error.message){
                        case "No such user":
                            this.noAccount = true;
                            this.wrongInput = false;
                            break;

                    }
                }
            );
    }

    onFBLogin() {
        this.authService.FBSignIn();
    }

    onTTRLogin() {
        this.authService.TTRSignIn();
    }

    onGGLLogin() {
        this.authService.GGLSignIn();
    }

}
