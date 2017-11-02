import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../authentication.service"
import {User} from "../../models/user.model";
import {DataService} from "../../data.service";


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit{

    signInForm: FormGroup;

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
        const callsUrl: string = 'https://api-storage.herokuapp.com/api/user';
        const user = new User(form.value.username, form.value.password);
        this.authService.signIn(user, callsUrl)
            .subscribe(
                data => {
                    console.log(data);
                    //here i save the token and the userId returned from the server
                    //to the local browser memory. This memory lasts for 2 hours
                    this.authService.assignLocalData(data, 'form');
                    this.router.navigateByUrl('/user-profile');
                },
                error => {
                    console.error(error)
                }
            );
    }

    onFBLogin() {
        let instance = this;
        const callsFBUrl = 'https://api-storage.herokuapp.com/api/user';

        this.authService.FBSignIn(function (response) {
            //this is the callback function i send to the service to be called after producing the FBuser
            //It would be better to develop it with promises. Thoough i dont understand them so well
            instance.authService.signUp(response, callsFBUrl)
                .subscribe(
                    data => {
                        instance.dataService.userData = data;
                        instance.authService.assignLocalData(data, 'facebook');
                        instance.router.navigateByUrl('main/profile');
                    },
                    error => console.error(error));
        });
    }

/*    onTTRLogin(){
        this.authService.TTRSignIn();
    }*/
    onGGLLogin(){
        this.authService.GGLSignIn();
    }

}
