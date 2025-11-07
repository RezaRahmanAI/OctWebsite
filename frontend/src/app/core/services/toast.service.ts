import { Injectable, signal } from '@angular/core';
import { createId } from '../utils/uuid';

type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(message: string, type: ToastType = 'info', timeout = 4000): void {
    const toast: ToastMessage = { id: createId(), type, message, timeout };
    this.toastsSignal.update(list => [...list, toast]);
    if (timeout) {
      setTimeout(() => this.dismiss(toast.id), timeout);
    }
  }

  dismiss(id: string): void {
    this.toastsSignal.update(list => list.filter(item => item.id !== id));
  }
}
