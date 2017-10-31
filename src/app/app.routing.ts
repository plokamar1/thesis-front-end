import {RouterModule, Routes} from "@angular/router";

import { AuthenticationComponent} from "./authentication/authentication.component";
import { SignUpComponent } from "./authentication/sign-up/sign-up.component"
import { SignInComponent } from "./authentication/sign-in/sign-in.component"
import {ProfileComponent} from "./main/profile/profile.component";
import { MainComponent} from "./main/main.component";
import { ProfileResolveService } from "./main/profile/profile-resolve.service";

const APP_ROUTES: Routes = [
    {path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
    {path: 'auth', component: AuthenticationComponent,
    children: [
        {path: 'sign-in', component: SignInComponent },
        {path: 'sign-up', component: SignUpComponent }
    ]},

    {path: 'main', component: MainComponent,
    children: [
        {path: 'profile', component: ProfileComponent}
    ]}
];

export const routing = RouterModule.forRoot(APP_ROUTES);
