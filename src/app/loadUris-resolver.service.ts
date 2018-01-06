import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from "@angular/router";
import {AuthenticationService} from "./authentication.service";
declare const gapi: any;
@Injectable()

export class LoadUrisResolver implements Resolve <any> {

    constructor(private authService: AuthenticationService,
                private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        return this.authService.get_URI()
    }

}
