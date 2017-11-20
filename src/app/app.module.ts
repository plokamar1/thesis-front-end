import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { AuthenticationComponent} from "./authentication/authentication.component";
import {SignInComponent} from "./authentication/sign-in/sign-in.component";
import {SignUpComponent} from "./authentication/sign-up/sign-up.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {routing} from "./app.routing";
import {HttpModule} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {ProfileComponent} from "./main/profile/profile.component";
import {DataService} from "./data.service";
import { MainComponent } from './main/main.component';
import { AccountComponent } from './main/profile/account/account.component';
import { HeaderComponent } from './main/header/header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './main/home/home.component';
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

    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        HttpModule,
        NgbModule.forRoot(),
    ],
    bootstrap: [AppComponent],
    providers: [AuthenticationService, DataService]
})
export class AppModule {

}
