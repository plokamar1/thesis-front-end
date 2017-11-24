import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../data.service';

@Component({
    selector: 'app-email-reader',
    templateUrl: './email-reader.component.html',
    styleUrls: ['./email-reader.component.css']
})
export class EmailReaderComponent implements OnInit {
    containerHeight: string;

    constructor(private dataService: DataService) {
        this.containerHeight = (window.screen.height * 0.85) + 'px';
    }
    onResize($event) {
        this.containerHeight = ($event.target.innerHeight * 0.85) + 'px';
    }

    ngOnInit() {
    }

}
