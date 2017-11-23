import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    constructor(private authService: AuthenticationService,
                private router: Router) {
        router.navigateByUrl('/main/home');
    }

    ngOnInit() {
    }

}
