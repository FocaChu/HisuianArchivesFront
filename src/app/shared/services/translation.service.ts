import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations = new BehaviorSubject<any>({});
  public translations$ = this.translations.asObservable();

  private currentLang: string;

  constructor(private http: HttpClient) {
    this.currentLang = localStorage.getItem('app_lang') || 'pt-BR';
    this.loadTranslations(this.currentLang);
  }

public loadTranslations(lang: string): void {
  const url = `/i18n/${lang}.json`; 

  console.log(`Attempting to load translations from: ${url}`);

  this.http.get(url).subscribe(
    (response: any) => {
      console.log('Translations loaded successfully:', response);
      this.translations.next(response);
    },
    (error) => {
      console.error(`Failed to load translations for ${lang}`, error);
    }
  );
}

  public setLanguage(lang: string): void {
    this.currentLang = lang;
    localStorage.setItem('app_lang', lang);
    this.loadTranslations(lang);
  }

  public getCurrentLanguage(): string {
    return this.currentLang;
  }
}