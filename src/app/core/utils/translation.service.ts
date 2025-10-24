import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private _translations = new BehaviorSubject<any>({});
  public readonly translations$ = this._translations.asObservable();

  private readonly LANGUAGE_STORAGE_KEY = 'user_language';
  private readonly DEFAULT_LANGUAGE = 'pt-BR';
  private readonly SUPPORTED_LANGUAGES = ['pt-BR', 'en', 'es'];

  private currentLang: string;

  constructor(private http: HttpClient) {
    this.currentLang = this.getInitialLanguage();
    this.loadTranslations(this.currentLang);
  }

  /**
   * Determines the initial language to load based on:
   * 1. Saved preference in localStorage
   * 2. Browser language detection
   * 3. Default fallback language
   */
  private getInitialLanguage(): string {
    // 1. Try to load from localStorage first
    const savedLanguage = localStorage.getItem(this.LANGUAGE_STORAGE_KEY);
    if (savedLanguage && this.SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return savedLanguage;
    }

    // 2. Detect browser language
    const browserLang = navigator.language || navigator.languages?.[0];
    if (browserLang) {
      // Map browser language codes to our supported codes
      const mappedLang = this.mapBrowserLanguage(browserLang);
      if (mappedLang) {
        return mappedLang;
      }
    }

    // 3. Fallback to default language
    return this.DEFAULT_LANGUAGE;
  }

  /**
   * Maps browser language codes to our supported language codes
   * @param browserLang - Browser language code (e.g., 'en-US', 'pt', 'es-ES')
   * @returns Mapped language code or null if not supported
   */
  private mapBrowserLanguage(browserLang: string): string | null {
    const langMap: { [key: string]: string } = {
      'pt': 'pt-BR',
      'pt-BR': 'pt-BR',
      'en': 'en',
      'en-US': 'en',
      'en-GB': 'en',
      'es': 'es',
      'es-ES': 'es',
      'es-MX': 'es'
    };

    return langMap[browserLang] || null;
  }

  /**
   * Sets the application language and persists the preference
   * @param lang - Language code to set
   */
  setLanguage(lang: string): void {
    if (!this.SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }

    this.currentLang = lang;
    // Save to localStorage for persistence across page reloads
    localStorage.setItem(this.LANGUAGE_STORAGE_KEY, lang);
    this.loadTranslations(lang);
  }

  /**
   * Gets the current language code
   * @returns Current language code
   */
  getCurrentLanguage(): string {
    return this.currentLang;
  }

  /**
   * Loads translation file for the specified language
   * @param lang - Language code to load
   */
  private loadTranslations(lang: string): void {
    this.http.get(`/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this._translations.next(data);
      },
      error: (err) => {
        console.error(`Error loading translation file for ${lang}:`, err);
        // Fallback to default language if current language fails
        if (lang !== this.DEFAULT_LANGUAGE) {
          console.log(`Falling back to default language: ${this.DEFAULT_LANGUAGE}`);
          this.setLanguage(this.DEFAULT_LANGUAGE);
        }
      }
    });
  }

  /**
   * Clears the saved language preference from localStorage
   * Useful for logout or resetting user preferences
   */
  clearLanguagePreference(): void {
    localStorage.removeItem(this.LANGUAGE_STORAGE_KEY);
  }

  /**
   * Gets the list of supported languages
   * @returns Array of supported language codes
   */
  getSupportedLanguages(): string[] {
    return [...this.SUPPORTED_LANGUAGES];
  }
}
