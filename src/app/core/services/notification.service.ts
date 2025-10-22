import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor() { }

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

  success(message: string, duration?: number): void {
    this.addNotification({ type: 'success', message, duration });
  }

  error(message: string, duration?: number): void {
    this.addNotification({ type: 'error', message, duration });
  }

  warning(message: string, duration?: number): void {
    this.addNotification({ type: 'warning', message, duration });
  }

  info(message: string, duration?: number): void {
    this.addNotification({ type: 'info', message, duration });
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }
}
