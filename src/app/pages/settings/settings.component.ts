import { Component } from '@angular/core';
import { TranslationService } from '../../core/utils/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    TranslatePipe,  
    FormsModule,
    CommonModule,
    ButtonComponent
  ]
})
export class SettingsComponent {
  currentLanguage: string;

  constructor(
    private translationService: TranslationService,
    private authService: AuthService 
  ) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
  }

  onLanguageChange(lang: string): void {
    this.translationService.setLanguage(lang);
    this.currentLanguage = lang;
  }
  
  onLogout(): void {
    this.authService.logout();
  }
}