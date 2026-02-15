import { Injectable, signal } from '@angular/core';

import type { FilterSelection } from '../models/types';

const defaultFilterSelection: FilterSelection = {
  bodyRegions: [],
  bodySystems: [],
  vindicateCategories: [],
  osteopathicModels: [],
  symptoms: [],
};

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  readonly selection = signal<FilterSelection>(defaultFilterSelection);

  setSelection(selection: FilterSelection): void {
    const nextSelection: FilterSelection = {
      bodyRegions: [...selection.bodyRegions],
      bodySystems: [...selection.bodySystems],
      vindicateCategories: [...selection.vindicateCategories],
      osteopathicModels: [...selection.osteopathicModels],
      symptoms: [...selection.symptoms],
    };

    this.selection.set(nextSelection);
  }

  clearSelection(): void {
    this.setSelection(defaultFilterSelection);
  }
}
