import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private _translations = new BehaviorSubject<any>({});
  public readonly translations$ = this._translations.asObservable();

  private currentLang: string = 'pt-BR'; // Default language

  constructor(private http: HttpClient) {
    this.loadTranslations(this.currentLang);
  }

  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.loadTranslations(lang);
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }

  private loadTranslations(lang: string): void {
    this.http.get(`/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this._translations.next(data);
      },
      error: (err) => {
        console.error(`Erro ao carregar o arquivo de tradução para ${lang}:`, err);
      }
    });
  }
}
