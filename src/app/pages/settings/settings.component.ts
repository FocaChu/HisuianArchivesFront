import { Component } from '@angular/core';
import { TranslationService } from '../../shared/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    TranslatePipe,  
    FormsModule,
    CommonModule,
    RouterModule
  ]
})
export class SettingsComponent {
  currentLanguage: string;

  constructor(private translationService: TranslationService) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
  }

  onLanguageChange(lang: string): void {
    this.translationService.setLanguage(lang);
    this.currentLanguage = lang;
  }
}