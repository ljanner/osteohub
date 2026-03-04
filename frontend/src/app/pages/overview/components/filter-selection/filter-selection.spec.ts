/* eslint-disable @typescript-eslint/dot-notation */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { vi } from 'vitest';

import { environment } from '../../../../../environments/environment';

globalThis.ResizeObserver ??= class {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};

import type {
  BodyRegion,
  BodySystem,
  OsteopathicModel,
  Symptom,
  VindicateCategory,
} from '../../../../models/types';
import { FilterStateService } from '../../../../services/filter-state.service';
import { FilterSelectionComponent } from './filter-selection';

const API = environment.apiBaseUrl;

const mockBodyRegions: BodyRegion[] = [
  { id: 1, name: 'Kopf' },
  { id: 2, name: 'Thorax' },
];
const mockBodySystems: BodySystem[] = [{ id: 1, name: 'Nervensystem' }];
const mockVindicateCategories: VindicateCategory[] = [{ id: 1, name: 'Vaskulär' }];
const mockOsteopathicModels: OsteopathicModel[] = [{ id: 1, name: 'Biomechanisch' }];
const mockSymptoms: Symptom[] = [
  { id: 1, name: 'Schmerz' },
  { id: 2, name: 'Übelkeit' },
];

const mockToastService = {
  showToastNotification: vi.fn(),
};

describe('FilterSelectionComponent', () => {
  let component: FilterSelectionComponent;
  let fixture: ComponentFixture<FilterSelectionComponent>;
  let httpTestingController: HttpTestingController;
  let filterStateService: FilterStateService;

  beforeEach(async () => {
    mockToastService.showToastNotification.mockClear();

    await TestBed.configureTestingModule({
      imports: [FilterSelectionComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SiToastNotificationService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSelectionComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    filterStateService = TestBed.inject(FilterStateService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  /** Triggers ngOnInit and flushes all 5 API requests with the given data. */
  const initWithData = async (
    data: {
      bodyRegions?: BodyRegion[];
      bodySystems?: BodySystem[];
      vindicateCategories?: VindicateCategory[];
      osteopathicModels?: OsteopathicModel[];
      symptoms?: Symptom[];
    } = {},
  ) => {
    fixture.detectChanges();
    httpTestingController.expectOne(`${API}/body-region`).flush(data.bodyRegions ?? []);
    httpTestingController.expectOne(`${API}/body-system`).flush(data.bodySystems ?? []);
    httpTestingController
      .expectOne(`${API}/vindicate-category`)
      .flush(data.vindicateCategories ?? []);
    httpTestingController.expectOne(`${API}/osteopathic-model`).flush(data.osteopathicModels ?? []);
    httpTestingController.expectOne(`${API}/symptom`).flush(data.symptoms ?? []);
    await fixture.whenStable();
  };

  /** Triggers ngOnInit, fails the specified endpoints and flushes the rest. */
  const initWithErrors = async (failEndpoints: string[]) => {
    fixture.detectChanges();

    const endpoints: Record<string, unknown[]> = {
      '/body-region': mockBodyRegions,
      '/body-system': mockBodySystems,
      '/vindicate-category': mockVindicateCategories,
      '/osteopathic-model': mockOsteopathicModels,
      '/symptom': mockSymptoms,
    };

    for (const [path, data] of Object.entries(endpoints)) {
      const req = httpTestingController.expectOne(`${API}${path}`);
      if (failEndpoints.includes(path)) {
        req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      } else {
        req.flush(data);
      }
    }
    await fixture.whenStable();
  };

  it('should create', async () => {
    await initWithData();
    expect(component).toBeTruthy();
  });

  describe('API loading', () => {
    it('should map API responses to select options', async () => {
      await initWithData({
        bodyRegions: mockBodyRegions,
        bodySystems: mockBodySystems,
        vindicateCategories: mockVindicateCategories,
        osteopathicModels: mockOsteopathicModels,
        symptoms: mockSymptoms,
      });

      expect(component['bodyRegionsOptions']).toEqual([
        { type: 'option', label: 'Kopf', value: 1 },
        { type: 'option', label: 'Thorax', value: 2 },
      ]);
      expect(component['bodySystemsOptions']).toEqual([
        { type: 'option', label: 'Nervensystem', value: 1 },
      ]);
      expect(component['vindicateCategoriesOptions']).toEqual([
        { type: 'option', label: 'Vaskulär', value: 1 },
      ]);
      expect(component['osteopathicModelsOptions']).toEqual([
        { type: 'option', label: 'Biomechanisch', value: 1 },
      ]);
      expect(component['symptomsOptions']).toEqual([
        { type: 'option', label: 'Schmerz', value: 1 },
        { type: 'option', label: 'Übelkeit', value: 2 },
      ]);
    });

    it('should show disabled placeholder when API returns empty arrays', async () => {
      await initWithData();

      expect(component['bodyRegionsOptions']).toEqual([
        { type: 'option', label: 'Keine Körperregionen verfügbar', value: -1, disabled: true },
      ]);
      expect(component['bodySystemsOptions']).toEqual([
        { type: 'option', label: 'Keine Körpersysteme verfügbar', value: -1, disabled: true },
      ]);
      expect(component['vindicateCategoriesOptions']).toEqual([
        {
          type: 'option',
          label: 'Keine VINDICATE-Kategorien verfügbar',
          value: -1,
          disabled: true,
        },
      ]);
      expect(component['osteopathicModelsOptions']).toEqual([
        {
          type: 'option',
          label: 'Keine osteopathischen Modelle verfügbar',
          value: -1,
          disabled: true,
        },
      ]);
      expect(component['symptomsOptions']).toEqual([
        { type: 'option', label: 'Keine Symptome verfügbar', value: -1, disabled: true },
      ]);
    });
  });

  describe('API error handling', () => {
    it('should show toast notification when an API call fails', async () => {
      await initWithErrors(['/body-region']);

      expect(mockToastService.showToastNotification).toHaveBeenCalledOnce();
      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'danger',
          title: 'Filter konnten nicht vollständig geladen werden',
        }),
      );
    });

    it('should show disabled placeholder for failed endpoint', async () => {
      await initWithErrors(['/symptom']);

      expect(component['symptomsOptions']).toEqual([
        { type: 'option', label: 'Keine Symptome verfügbar', value: -1, disabled: true },
      ]);
    });

    it('should still populate successful endpoints when others fail', async () => {
      await initWithErrors(['/body-region']);

      expect(component['bodySystemsOptions']).toEqual([
        { type: 'option', label: 'Nervensystem', value: 1 },
      ]);
    });

    it('should show only one toast even when multiple endpoints fail', async () => {
      await initWithErrors(['/body-region', '/body-system', '/symptom']);

      expect(mockToastService.showToastNotification).toHaveBeenCalledTimes(1);
    });

    it('should show disabled placeholder when osteopathic-model endpoint fails', async () => {
      await initWithErrors(['/osteopathic-model']);

      expect(component['osteopathicModelsOptions']).toEqual([
        {
          type: 'option',
          label: 'Keine osteopathischen Modelle verfügbar',
          value: -1,
          disabled: true,
        },
      ]);
    });

    it('should show disabled placeholder when vindicate-category endpoint fails', async () => {
      await initWithErrors(['/vindicate-category']);

      expect(component['vindicateCategoriesOptions']).toEqual([
        {
          type: 'option',
          label: 'Keine VINDICATE-Kategorien verfügbar',
          value: -1,
          disabled: true,
        },
      ]);
    });
  });

  describe('onLayoutResize', () => {
    it('should set isMobile to true when width is below breakpoint', async () => {
      await initWithData();

      component['onLayoutResize']({ width: 500 });
      expect(component['isMobile']()).toBe(true);
    });

    it('should set isMobile to true when width equals breakpoint', async () => {
      await initWithData();

      component['onLayoutResize']({ width: 576 });
      expect(component['isMobile']()).toBe(true);
    });

    it('should set isMobile to false when width exceeds breakpoint', async () => {
      await initWithData();

      component['onLayoutResize']({ width: 577 });
      expect(component['isMobile']()).toBe(false);
    });

    it('should not change isMobile when event has no width property', async () => {
      await initWithData();

      component['isMobile'].set(true);
      component['onLayoutResize'](new Event('resize'));
      expect(component['isMobile']()).toBe(true);
    });
  });

  describe('filterOverview', () => {
    it('should update filter state service with selected values', async () => {
      await initWithData({ bodyRegions: mockBodyRegions, symptoms: mockSymptoms });

      component['bodyRegionIdsSelected'] = [1, 2];
      component['symptomIdsSelected'] = [2];
      component.filterOverview();

      const activeFilters = filterStateService.activeFilters();
      expect(activeFilters.bodyRegionIds).toEqual([1, 2]);
      expect(activeFilters.symptomIds).toEqual([2]);
      expect(activeFilters.bodySystemIds).toEqual([]);
    });

    it('should emit filtersChanged', async () => {
      await initWithData();

      const emitSpy = vi.spyOn(component.filtersChanged, 'emit');
      component.filterOverview();
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearAllFilters', () => {
    it('should reset all selections to empty', async () => {
      await initWithData({ bodyRegions: mockBodyRegions });

      component['bodyRegionIdsSelected'] = [1];
      component.filterOverview();
      expect(filterStateService.hasActiveFilters()).toBe(true);

      component['clearAllFilters']();

      expect(component['bodyRegionIdsSelected']).toEqual([]);
      expect(component['bodySystemIdsSelected']).toEqual([]);
      expect(component['vindicateCategoryIdsSelected']).toEqual([]);
      expect(component['osteopathicModelIdsSelected']).toEqual([]);
      expect(component['symptomIdsSelected']).toEqual([]);
    });

    it('should clear active filters in the service', async () => {
      await initWithData();

      component['bodyRegionIdsSelected'] = [1];
      component.filterOverview();

      component['clearAllFilters']();
      expect(filterStateService.activeFilters()).toEqual({
        bodyRegionIds: [],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
      });
    });

    it('should emit filtersChanged', async () => {
      await initWithData();

      const emitSpy = vi.spyOn(component.filtersChanged, 'emit');
      component['clearAllFilters']();
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should reset the search value', async () => {
      await initWithData();

      component['searchValue'].setValue('test', { emitEvent: false });
      component['clearAllFilters']();
      expect(component['searchValue'].value).toBe('');
    });

    it('should clear search term in filter state service', async () => {
      await initWithData();

      filterStateService.setSearchTerm('test');
      component['clearAllFilters']();
      expect(filterStateService.searchTerm()).toBe('');
    });
  });

  describe('hasActiveFilters', () => {
    it('should be false when no filters are selected', async () => {
      await initWithData();
      expect(component['hasActiveFilters']()).toBe(false);
    });

    it('should be true when at least one filter is selected', async () => {
      await initWithData();

      component['symptomIdsSelected'] = [1];
      component.filterOverview();
      expect(component['hasActiveFilters']()).toBe(true);
    });

    it('should be true when search has a value', async () => {
      await initWithData();

      filterStateService.setSearchTerm('test');
      expect(component['hasActiveFilters']()).toBe(true);
    });

    it('should return to false after clearing filters and search', async () => {
      await initWithData();

      component['bodyRegionIdsSelected'] = [1];
      component.filterOverview();
      expect(component['hasActiveFilters']()).toBe(true);

      component['clearAllFilters']();
      expect(component['hasActiveFilters']()).toBe(false);
    });
  });

  describe('constructor - restore filters from service', () => {
    it('should restore previously active filters on creation', () => {
      filterStateService.setActiveFilters({
        bodyRegionIds: [1],
        bodySystemIds: [2],
        vindicateCategoryIds: [],
        osteopathicModelIds: [3],
        symptomIds: [],
      });

      // Re-create component to trigger constructor (no detectChanges = no HTTP)
      const newFixture = TestBed.createComponent(FilterSelectionComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent['bodyRegionIdsSelected']).toEqual([1]);
      expect(newComponent['bodySystemIdsSelected']).toEqual([2]);
      expect(newComponent['osteopathicModelIdsSelected']).toEqual([3]);
      expect(newComponent['vindicateCategoryIdsSelected']).toEqual([]);
      expect(newComponent['symptomIdsSelected']).toEqual([]);
    });
  });
});
