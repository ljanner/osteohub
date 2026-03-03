import { TestBed } from '@angular/core/testing';

import { FilterStateService } from './filter-state.service';

describe('FilterStateService', () => {
  let service: FilterStateService;

  beforeEach(() => {
    service = TestBed.inject(FilterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('activeFilters', () => {
    it('should start with all empty arrays', () => {
      expect(service.activeFilters()).toEqual({
        bodyRegionIds: [],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
      });
    });
  });

  describe('setActiveFilters', () => {
    it('should update active filters', () => {
      service.setActiveFilters({
        bodyRegionIds: [1, 2],
        bodySystemIds: [3],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [5],
      });

      expect(service.activeFilters()).toEqual({
        bodyRegionIds: [1, 2],
        bodySystemIds: [3],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [5],
      });
    });

    it('should create copies of the input arrays', () => {
      const input = {
        bodyRegionIds: [1],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
      };

      service.setActiveFilters(input);
      input.bodyRegionIds.push(99);

      expect(service.activeFilters().bodyRegionIds).toEqual([1]);
    });

    it('should overwrite previous filters completely', () => {
      service.setActiveFilters({
        bodyRegionIds: [1],
        bodySystemIds: [2],
        vindicateCategoryIds: [3],
        osteopathicModelIds: [4],
        symptomIds: [5],
      });

      service.setActiveFilters({
        bodyRegionIds: [],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [10],
      });

      expect(service.activeFilters()).toEqual({
        bodyRegionIds: [],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [10],
      });
    });
  });

  describe('hasActiveFilters', () => {
    it('should be false when no filters are set', () => {
      expect(service.hasActiveFilters()).toBe(false);
    });

    it('should be true when one category has values', () => {
      service.setActiveFilters({
        bodyRegionIds: [],
        bodySystemIds: [],
        vindicateCategoryIds: [1],
        osteopathicModelIds: [],
        symptomIds: [],
      });

      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should be true when multiple categories have values', () => {
      service.setActiveFilters({
        bodyRegionIds: [1],
        bodySystemIds: [2],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [3],
      });

      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should be false after clearing filters', () => {
      service.setActiveFilters({
        bodyRegionIds: [1],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
      });

      expect(service.hasActiveFilters()).toBe(true);

      service.clearActiveFilters();
      expect(service.hasActiveFilters()).toBe(false);
    });
  });

  describe('clearActiveFilters', () => {
    it('should reset all filters to empty arrays', () => {
      service.setActiveFilters({
        bodyRegionIds: [1, 2],
        bodySystemIds: [3],
        vindicateCategoryIds: [4],
        osteopathicModelIds: [5],
        symptomIds: [6, 7],
      });

      service.clearActiveFilters();

      expect(service.activeFilters()).toEqual({
        bodyRegionIds: [],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
      });
    });

    it('should be safe to call when already empty', () => {
      service.clearActiveFilters();

      expect(service.activeFilters()).toEqual({
        bodyRegionIds: [],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
      });
    });
  });
});
