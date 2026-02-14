import { Injectable, signal } from '@angular/core';

import type { Filter } from '../models/filter';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private readonly collapsedSignal = signal(true);
  private readonly headingSignal = signal<string>('');
  public readonly selectedFilters = signal<Filter | null>(null);

  collapsed = this.collapsedSignal.asReadonly();
  heading = this.headingSignal.asReadonly();

  toggle(): void {
    this.collapsedSignal.update((v) => !v);
  }

  open(heading: string): void {
    this.headingSignal.set(heading);
    this.collapsedSignal.set(false);
  }

  close(): void {
    this.collapsedSignal.set(true);
  }
}
