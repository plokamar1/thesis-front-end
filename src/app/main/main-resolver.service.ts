import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from "@angular/router";
import {AuthenticationService} from "../authentication.service";

@Injectable()
export class MainResolverService implements Resolve <any>{

    constructor(private authService: AuthenticationService,
                private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot){
        return this.authService.loadApis().then(response => {
            return response;
            }
        )
    }

}
