import { computed, Injectable, signal } from '@angular/core';

import type { FilterCategories } from '../models/types';

const defaultActiveFilters: FilterCategories = {
  bodyRegions: [],
  bodySystems: [],
  vindicateCategories: [],
  osteopathicModels: [],
  symptoms: [],
};

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  readonly activeFilters = signal<FilterCategories>(defaultActiveFilters);
  readonly hasActiveFilters = computed(() => {
    return Object.values(this.activeFilters()).some((filterCategory) => filterCategory.length > 0);
  });

  setActiveFilters(activeFilters: FilterCategories): void {
    const nextActiveFilters: FilterCategories = {
      bodyRegions: [...activeFilters.bodyRegions],
      bodySystems: [...activeFilters.bodySystems],
      vindicateCategories: [...activeFilters.vindicateCategories],
      osteopathicModels: [...activeFilters.osteopathicModels],
      symptoms: [...activeFilters.symptoms],
    };

    this.activeFilters.set(nextActiveFilters);
  }

  clearActiveFilters(): void {
    this.setActiveFilters(defaultActiveFilters);
  }
}
