import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

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
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { EmailReaderComponent } from './main/home/email-reader/email-reader.component';
import {EmailService} from "./main/home/email-reader/email.service";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MalihuCustomScrollerModule } from 'ngx-malihu-scroller';
import {MatCardModule, MatAutocomplete} from '@angular/material';
import { EmailSenderComponent } from './main/home/email-reader/email-sender/email-sender.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SpinnerComponent } from './spinner/spinner.component';
import {AuthGuard} from './auth.guard';
import { ApisResolverService } from './apis-resolver.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {TinymceModule} from 'angular2-tinymce';
import { EmailViewerComponent } from './main/home/email-reader/email-viewer/email-viewer.component';
import { SafehtmlPipe } from './main/home/email-reader/safehtml.pipe'
import {LoadUrisResolver} from './loadUris-resolver.service';
import { TtrTimelineComponent } from './main/home/ttr-timeline/ttr-timeline.component';
import {TwitterService} from './main/home/ttr-timeline/twitter.service';
import { LinksPipe } from './main/home/ttr-timeline/links.pipe';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        routing,
        HttpModule,
        NgbModule.forRoot(),


        MatExpansionModule,MatAutocompleteModule,
        MatProgressSpinnerModule,MatInputModule,MatProgressBarModule,MatCardModule,MatCheckboxModule,MatSnackBarModule,

        MalihuCustomScrollerModule,

        TinymceModule.withConfig({
        })
    ],
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
        EmailSenderComponent,
        SpinnerComponent,
        EmailViewerComponent,
        SafehtmlPipe,
        TtrTimelineComponent,
        LinksPipe,
    ],
    providers: [
        DataService,
        RssReaderService,
        EmailService,
        AuthGuard,
        ApisResolverService,
        LoadUrisResolver,
        TwitterService,
        AuthenticationService,
        ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
