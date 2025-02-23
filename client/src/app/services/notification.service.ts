import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  // Request user permission
  requestPermission(): void {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.error('Notification permission denied.');
      }
    });
  }

  // Show a notification
  showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, options);

      // Optional: Handle click event
      notification.onclick = (event) => {
        console.log('Notification clicked:', event);
        window.focus();
      };
    } else {
      console.error('Notification permission not granted.');
    }
  }
}
