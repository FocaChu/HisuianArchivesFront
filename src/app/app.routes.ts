import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MainLayoutComponent } from './main/main-layout/main-layout.component';

export const routes: Routes = [
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