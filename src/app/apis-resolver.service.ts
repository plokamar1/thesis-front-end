import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from "@angular/router";
import {AuthenticationService} from "./authentication.service";
declare const gapi: any;
@Injectable()

export class ApisResolverService implements Resolve <any> {

    constructor(private authService: AuthenticationService,
                private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        if(!gapi.client) return this.authService.loadApis();
    }

}
