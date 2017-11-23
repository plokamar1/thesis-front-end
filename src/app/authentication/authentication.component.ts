import {Component, Input} from '@angular/core';
import {AuthenticationService} from '../authentication.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
    constructor(private authService: AuthenticationService) {
        authService.checkUserToken('main/profile');
    }

}
