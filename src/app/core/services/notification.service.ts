import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslationService } from '../utils/translation.service';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private translations: any = {};

  constructor(private translationService: TranslationService) {
    // Subscribe to translations changes
    this.translationService.translations$.subscribe(translations => {
      this.translations = translations;
    });
  }

  private addNotification(notification: Omit<Notification, 'id'>): void {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-dismiss after duration
    setTimeout(() => {
      this.removeNotification(id);
    }, newNotification.duration);
  }

  private translateMessage(messageKey: string): string {
    const keys = messageKey.split('.');
    let result = this.translations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return messageKey; // Return key if translation not found
      }
    }

    return result;
  }

  success(messageKey: string, duration?: number): void {
    const translatedMessage = this.translateMessage(messageKey);
    this.addNotification({ type: 'success', message: translatedMessage, duration });
  }

  error(messageKey: string, duration?: number): void {
    const translatedMessage = this.translateMessage(messageKey);
    this.addNotification({ type: 'error', message: translatedMessage, duration });
  }

  warning(messageKey: string, duration?: number): void {
    const translatedMessage = this.translateMessage(messageKey);
    this.addNotification({ type: 'warning', message: translatedMessage, duration });
  }

  info(messageKey: string, duration?: number): void {
    const translatedMessage = this.translateMessage(messageKey);
    this.addNotification({ type: 'info', message: translatedMessage, duration });
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }
}
