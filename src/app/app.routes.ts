import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MainLayoutComponent } from './main/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    
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
            }
        ]
    }
];