import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false 
})
export class TranslatePipe implements PipeTransform {
  private translations: any = {};

  constructor(private translationService: TranslationService) {
    this.translationService.translations$.subscribe(res => {
      this.translations = res;
    });
  }

  transform(key: string): string {
    if (!key) return '';

    const keys = key.split('.');
    let result = this.translations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }

    return result;
  }
}