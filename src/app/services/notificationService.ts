/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as Injectable service with providedIn: 'root'
 * - Use signals for reactive state:
 *   - nuovePratiche = signal<number>(0)
 *   - notifiche = signal<Notification[]>([])
 * - Implement WebSocket or polling for real-time updates
 * - Emit events when new pratiche arrive
 */

export interface Notification {
  id: string;
  tipo: 'nuova_pratica' | 'stato_modificato' | 'messaggio';
  titolo: string;
  messaggio: string;
  data: string;
  letta: boolean;
  praticaId?: string;
}

class NotificationService {
  private listeners: ((count: number) => void)[] = [];
  private notificationListeners: ((notifications: Notification[]) => void)[] = [];
  private count: number = 2; // 2 nuove pratiche non assegnate di default
  private notifications: Notification[] = [
    {
      id: '1',
      tipo: 'nuova_pratica',
      titolo: 'Nuova Pratica',
      messaggio: 'PR-2026-006 - BMW Serie 3',
      data: new Date().toISOString(),
      letta: false,
      praticaId: '6'
    },
    {
      id: '2',
      tipo: 'nuova_pratica',
      titolo: 'Nuova Pratica',
      messaggio: 'PR-2026-007 - Audi A4',
      data: new Date().toISOString(),
      letta: false,
      praticaId: '7'
    }
  ];

  subscribe(listener: (count: number) => void) {
    this.listeners.push(listener);
    listener(this.count);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  subscribeNotifications(listener: (notifications: Notification[]) => void) {
    this.notificationListeners.push(listener);
    listener(this.notifications);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(l => l !== listener);
    };
  }

  getCount(): number {
    return this.count;
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  decrementCount() {
    if (this.count > 0) {
      this.count--;
      this.notify();
    }
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.letta) {
      this.notifications = this.notifications.map(n => 
        n.id === notificationId ? { ...n, letta: true } : n
      );
      if (this.count > 0) {
        this.count--;
        this.notify();
      }
      this.notifyNotifications();
    }
  }

  clearAll() {
    this.notifications = this.notifications.map(n => ({ ...n, letta: true }));
    this.count = 0;
    this.notify();
    this.notifyNotifications();
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.count));
  }

  private notifyNotifications() {
    this.notificationListeners.forEach(listener => listener(this.notifications));
  }
}

export const notificationService = new NotificationService();