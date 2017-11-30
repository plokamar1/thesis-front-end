import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {SignInComponent} from './authentication/sign-in/sign-in.component';
import {SignUpComponent} from './authentication/sign-up/sign-up.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from './app.routing';
import {HttpModule} from '@angular/http';
import {AuthenticationService} from './authentication.service';
import {ProfileComponent} from './main/profile/profile.component';
import {DataService} from './data.service';
import {MainComponent} from './main/main.component';
import {AccountComponent} from './main/profile/account/account.component';
import {HeaderComponent} from './main/header/header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HomeComponent} from './main/home/home.component';
import {RssReaderComponent} from './main/home/rss-reader/rss-reader.component';
import {RssReaderService} from './main/home/rss-reader/rss-reader.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {MatCardModule} from "@angular/material";
import { EmailReaderComponent } from './main/home/email-reader/email-reader.component';
import{ MainResolverService} from "./main/main-resolver.service";

@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        SignInComponent,
        SignUpComponent,
        ProfileComponent,
        MainComponent,
        AccountComponent,
        HeaderComponent,
        HomeComponent,
        RssReaderComponent,
        EmailReaderComponent,


    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        HttpModule,
        NgbModule.forRoot(),
        MatExpansionModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatProgressBarModule,
        MalihuScrollbarModule.forRoot(),
        MatCardModule,

    ],
    bootstrap: [AppComponent],
    providers: [AuthenticationService, DataService, RssReaderService,MainResolverService]
})
export class AppModule {

}
