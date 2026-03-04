import { computed, Injectable, signal } from '@angular/core';

import type { DiseaseRelationsIds } from '../models/types';

const defaultActiveFilters: DiseaseRelationsIds = {
  bodyRegionIds: [],
  bodySystemIds: [],
  vindicateCategoryIds: [],
  osteopathicModelIds: [],
  symptomIds: [],
};

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  readonly activeFilters = signal<DiseaseRelationsIds>(defaultActiveFilters);
  readonly searchTerm = signal('');

  readonly hasActiveFilters = computed(() => {
    return Object.values(this.activeFilters()).some((filterCategory) => filterCategory.length > 0);
  });

  readonly hasActiveFiltersOrSearch = computed(
    () => this.hasActiveFilters() || this.searchTerm().trim().length > 0,
  );

  setActiveFilters(activeFilters: DiseaseRelationsIds): void {
    const nextActiveFilters: DiseaseRelationsIds = {
      bodyRegionIds: [...activeFilters.bodyRegionIds],
      bodySystemIds: [...activeFilters.bodySystemIds],
      vindicateCategoryIds: [...activeFilters.vindicateCategoryIds],
      osteopathicModelIds: [...activeFilters.osteopathicModelIds],
      symptomIds: [...activeFilters.symptomIds],
    };

    this.activeFilters.set(nextActiveFilters);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  clearActiveFilters(): void {
    this.setActiveFilters(defaultActiveFilters);
  }

  clearAll(): void {
    this.clearActiveFilters();
    this.searchTerm.set('');
  }
}
