import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../data.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    data: any;
    constructor(private route: ActivatedRoute,
                private dataService: DataService) {
        //router.navigateByUrl('/main/home');
    }

    ngOnInit() {
        this.data = this.route.snapshot.data;
        this.dataService.userData = this.data.data;
        //console.log(this.data.data);
    }

}
