import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/pages/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/auth/pages/profile.component';
import { EditProfileComponent } from './features/auth/pages/edit-profile.component';
import { RegisterComponent } from './features/auth/pages/register.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [authGuard]
            },
            {
                path: 'profile/edit',
                component: EditProfileComponent,
                canActivate: [authGuard]
            },
            {
                path: 'about',
                component: AboutComponent
            }
        ]
    }
];