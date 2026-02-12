import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private readonly collapsedSignal = signal(true);

  collapsed = this.collapsedSignal.asReadonly();

  toggle(): void {
    this.collapsedSignal.update((v) => !v);
  }

  open(): void {
    this.collapsedSignal.set(false);
  }

  close(): void {
    this.collapsedSignal.set(true);
  }
}
