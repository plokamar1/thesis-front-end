import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

    constructor(private authService: AuthenticationService,
        private router: Router) { }

    ngOnInit() {

        var prov = this.router.parseUrl(this.router.url).queryParams["prov"];
        if (prov) {
            if (prov === 'ggl') {
                const code = this.router.parseUrl(this.router.url).queryParams["code"];
                this.authService.postCode(code, 'ggl');
            }
            if (prov === 'fb') {
                const code = this.router.parseUrl(this.router.url).queryParams["code"];
                console.log(code);
                this.authService.postCode(code, 'fb');
            }
            if (prov === 'ttr') {
                let code = this.router.url
                code = 'http://localhost:4200'.concat(code)
                this.authService.postCode(code, 'ttr');
                console.log(code)
            }
        } else {
            this.router.navigateByUrl('/auth/sing-in')
        }
    }

}
