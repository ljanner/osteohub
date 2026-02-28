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
        bodyRegions: [],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      });
    });
  });

  describe('setActiveFilters', () => {
    it('should update active filters', () => {
      service.setActiveFilters({
        bodyRegions: [1, 2],
        bodySystems: [3],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [5],
      });

      expect(service.activeFilters()).toEqual({
        bodyRegions: [1, 2],
        bodySystems: [3],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [5],
      });
    });

    it('should create copies of the input arrays', () => {
      const input = {
        bodyRegions: [1],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      };

      service.setActiveFilters(input);
      input.bodyRegions.push(99);

      expect(service.activeFilters().bodyRegions).toEqual([1]);
    });

    it('should overwrite previous filters completely', () => {
      service.setActiveFilters({
        bodyRegions: [1],
        bodySystems: [2],
        vindicateCategories: [3],
        osteopathicModels: [4],
        symptoms: [5],
      });

      service.setActiveFilters({
        bodyRegions: [],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [10],
      });

      expect(service.activeFilters()).toEqual({
        bodyRegions: [],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [10],
      });
    });
  });

  describe('hasActiveFilters', () => {
    it('should be false when no filters are set', () => {
      expect(service.hasActiveFilters()).toBe(false);
    });

    it('should be true when one category has values', () => {
      service.setActiveFilters({
        bodyRegions: [],
        bodySystems: [],
        vindicateCategories: [1],
        osteopathicModels: [],
        symptoms: [],
      });

      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should be true when multiple categories have values', () => {
      service.setActiveFilters({
        bodyRegions: [1],
        bodySystems: [2],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [3],
      });

      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should be false after clearing filters', () => {
      service.setActiveFilters({
        bodyRegions: [1],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      });

      expect(service.hasActiveFilters()).toBe(true);

      service.clearActiveFilters();
      expect(service.hasActiveFilters()).toBe(false);
    });
  });

  describe('clearActiveFilters', () => {
    it('should reset all filters to empty arrays', () => {
      service.setActiveFilters({
        bodyRegions: [1, 2],
        bodySystems: [3],
        vindicateCategories: [4],
        osteopathicModels: [5],
        symptoms: [6, 7],
      });

      service.clearActiveFilters();

      expect(service.activeFilters()).toEqual({
        bodyRegions: [],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      });
    });

    it('should be safe to call when already empty', () => {
      service.clearActiveFilters();

      expect(service.activeFilters()).toEqual({
        bodyRegions: [],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      });
    });
  });
});
