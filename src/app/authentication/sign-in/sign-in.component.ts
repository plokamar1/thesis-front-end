import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthenticationService} from '../../authentication.service'
import {User} from '../../models/user.model';
import {DataService} from '../../data.service';


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {

    signInForm: FormGroup;
    wrongInput = false;
    noAccount = false;
    gglURL :string;
    fbURL: string;
    ttrURL: string;

    constructor(private authService: AuthenticationService,
                private router: Router,
                private dataService: DataService,
                private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        // onInit i declare and create the formgroup object which has the characteristics
        // of the form elements.
        this.signInForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
        //Here i get all the uris that are binded to the social media buttons
        this.authService.get_URI()
            .subscribe(data => {
                console.log(data);
                this.gglURL = data.ggl_uri;
                this.fbURL = data.fb_uri;
                this.ttrURL = data.ttr_uri;
            }, error =>{
                console.log(error);
                this.gglURL = '';
                this.fbURL = '';
                this.ttrURL = '';
            });

    }

    onSignIn(form) {
        const that = this;
        const callsUrl = 'http://127.0.0.1:5000/api/user';
        const user = new User(form.value.username, form.value.password);
        this.authService.signIn(user, callsUrl)
            .subscribe(
                data => {
                    console.log(data)
                    this.authService.assignLocalData(data);
                    this.router.navigateByUrl('main/home');

                }, error => {
                    switch (error.message) {
                        case 'No such user':
                            this.noAccount = true;
                            this.wrongInput = false;
                            break;
                        case 'Wrong Credentials':
                            this.wrongInput = true;
                            this.noAccount = false;
                            break;
                    }
                }
            );
    }
}
