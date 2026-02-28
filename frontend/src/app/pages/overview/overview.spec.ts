/* eslint-disable @typescript-eslint/dot-notation */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiSidePanelService } from '@siemens/element-ng/side-panel';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

import { environment } from '../../../environments/environment';
import type { Disease, DiseaseExtended } from '../../models/types';
import { FilterStateService } from '../../services/filter-state.service';
import { OverviewComponent } from './overview';

const API = environment.apiBaseUrl;

const mockDisease = (id: number, name: string, description = ''): Disease => ({
  id,
  name,
  description,
  bodyRegions: [],
  bodySystems: [],
  vindicateCategories: [],
  osteopathicModels: [],
  symptoms: [],
});

const mockDiseaseExtended = (disease: Disease): DiseaseExtended => ({
  ...disease,
  icd: '',
  frequency: '',
  etiology: '',
  pathogenesis: '',
  redFlags: '',
  diagnostics: '',
  therapy: '',
  prognosis: '',
  osteopathicTreatment: '',
});

const mockToastService = {
  showToastNotification: vi.fn(),
};

const isOpen$ = new Subject<boolean>();
const mockSidePanelService = {
  isOpen: () => signal(false),
  isOpen$,
  open: vi.fn(),
  setSidePanelContent: vi.fn(),
};

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let httpTestingController: HttpTestingController;
  let filterStateService: FilterStateService;

  beforeEach(async () => {
    mockToastService.showToastNotification.mockClear();
    mockSidePanelService.open.mockClear();
    mockSidePanelService.setSidePanelContent.mockClear();

    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SiToastNotificationService, useValue: mockToastService },
        { provide: SiSidePanelService, useValue: mockSidePanelService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    filterStateService = TestBed.inject(FilterStateService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  /** Flush the 5 filter-selection HTTP requests that fire on init. */
  const flushFilterRequests = () => {
    httpTestingController.expectOne(`${API}/body-region`).flush([]);
    httpTestingController.expectOne(`${API}/body-system`).flush([]);
    httpTestingController.expectOne(`${API}/vindicate-category`).flush([]);
    httpTestingController.expectOne(`${API}/osteopathic-model`).flush([]);
    httpTestingController.expectOne(`${API}/symptom`).flush([]);
  };

  /** Flush the initial /disease request with given data. */
  const initWithDiseases = async (diseases: Disease[]) => {
    fixture.detectChanges();
    httpTestingController.expectOne(`${API}/disease`).flush(diseases);
    flushFilterRequests();
    await fixture.whenStable();
  };

  /** Flush the initial /disease request with an error. */
  const initWithError = async () => {
    fixture.detectChanges();
    httpTestingController
      .expectOne(`${API}/disease`)
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    flushFilterRequests();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await initWithDiseases([]);
    expect(component).toBeTruthy();
  });

  describe('loadDiseases', () => {
    it('should set dataState to ready and populate diseases', async () => {
      const diseases = [mockDisease(1, 'Migräne'), mockDisease(2, 'Skoliose')];
      await initWithDiseases(diseases);

      expect(component['dataState']()).toBe('ready');
      expect(component['filteredDiseases']()).toEqual(diseases);
    });

    it('should set dataState to empty when API returns no diseases', async () => {
      await initWithDiseases([]);

      expect(component['dataState']()).toBe('empty');
      expect(component['filteredDiseases']()).toEqual([]);
    });

    it('should set dataState to error and show toast on API failure', async () => {
      await initWithError();

      expect(component['dataState']()).toBe('error');
      expect(component['filteredDiseases']()).toBeNull();
      expect(mockToastService.showToastNotification).toHaveBeenCalledOnce();
      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'danger',
          title: 'Krankheiten konnten nicht geladen werden',
        }),
      );
    });

    it('should reset state before reloading', async () => {
      const diseases = [mockDisease(1, 'Migräne')];
      await initWithDiseases(diseases);
      expect(component['dataState']()).toBe('ready');

      // Trigger reload
      component.loadDiseases();
      expect(component['dataState']()).toBe('loading');
      expect(component['filteredDiseases']()).toBeNull();
      expect(component['allDiseases']()).toBeNull();

      // Flush the second request
      httpTestingController.expectOne(`${API}/disease`).flush([]);
      await fixture.whenStable();
      expect(component['dataState']()).toBe('empty');
    });
  });

  describe('filterOverview - search', () => {
    it('should filter diseases by name (case-insensitive)', async () => {
      const diseases = [mockDisease(1, 'Migräne'), mockDisease(2, 'Skoliose')];
      await initWithDiseases(diseases);

      component.searchValue.setValue('migräne');
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(1);
      expect(component['filteredDiseases']()![0].name).toBe('Migräne');
    });

    it('should filter diseases by description', async () => {
      const diseases = [
        mockDisease(1, 'Migräne', 'Kopfschmerz'),
        mockDisease(2, 'Skoliose', 'Wirbelsäule'),
      ];
      await initWithDiseases(diseases);

      component.searchValue.setValue('wirbel');
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(1);
      expect(component['filteredDiseases']()![0].name).toBe('Skoliose');
    });

    it('should show all diseases when search is empty', async () => {
      const diseases = [mockDisease(1, 'Migräne'), mockDisease(2, 'Skoliose')];
      await initWithDiseases(diseases);

      component.searchValue.setValue('');
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(2);
    });

    it('should trim whitespace from search term', async () => {
      const diseases = [mockDisease(1, 'Migräne')];
      await initWithDiseases(diseases);

      component.searchValue.setValue('  migräne  ');
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(1);
    });

    it('should return no results when search matches nothing', async () => {
      const diseases = [mockDisease(1, 'Migräne')];
      await initWithDiseases(diseases);

      component.searchValue.setValue('xyz');
      component.filterOverview();

      expect(component['filteredDiseases']()).toEqual([]);
    });

    it('should not filter when allDiseases is null', async () => {
      fixture.detectChanges();
      component.filterOverview();
      expect(component['filteredDiseases']()).toBeNull();
      httpTestingController.expectOne(`${API}/disease`).flush([]);
      flushFilterRequests();
      await fixture.whenStable();
    });
  });

  describe('filterOverview - category filters', () => {
    it('should filter by body region', async () => {
      const diseases = [
        { ...mockDisease(1, 'Migräne'), bodyRegions: [{ id: 1, name: 'Kopf' }] },
        { ...mockDisease(2, 'Skoliose'), bodyRegions: [{ id: 2, name: 'Rücken' }] },
      ];
      await initWithDiseases(diseases);

      filterStateService.setActiveFilters({
        bodyRegions: [1],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      });
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(1);
      expect(component['filteredDiseases']()![0].name).toBe('Migräne');
    });

    it('should show all when no category filters are active', async () => {
      const diseases = [mockDisease(1, 'Migräne'), mockDisease(2, 'Skoliose')];
      await initWithDiseases(diseases);

      filterStateService.clearActiveFilters();
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(2);
    });

    it('should combine search and category filters', async () => {
      const diseases = [
        { ...mockDisease(1, 'Migräne'), bodyRegions: [{ id: 1, name: 'Kopf' }] },
        { ...mockDisease(2, 'Kopfschmerz'), bodyRegions: [{ id: 2, name: 'Rücken' }] },
        { ...mockDisease(3, 'Skoliose'), bodyRegions: [{ id: 1, name: 'Kopf' }] },
      ];
      await initWithDiseases(diseases);

      filterStateService.setActiveFilters({
        bodyRegions: [1],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      });
      component.searchValue.setValue('migräne');
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(1);
      expect(component['filteredDiseases']()![0].name).toBe('Migräne');
    });

    it('should match if disease has any of the selected filter values', async () => {
      const diseases = [
        {
          ...mockDisease(1, 'Migräne'),
          bodySystems: [
            { id: 1, name: 'Nervensystem' },
            { id: 2, name: 'Gefäßsystem' },
          ],
        },
      ];
      await initWithDiseases(diseases);

      filterStateService.setActiveFilters({
        bodyRegions: [],
        bodySystems: [2],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [],
      });
      component.filterOverview();

      expect(component['filteredDiseases']()?.length).toBe(1);
    });

    it('should require all filter categories to match (AND logic)', async () => {
      const diseases = [
        {
          ...mockDisease(1, 'Migräne'),
          bodyRegions: [{ id: 1, name: 'Kopf' }],
          symptoms: [{ id: 10, name: 'Schmerz' }],
        },
      ];
      await initWithDiseases(diseases);

      filterStateService.setActiveFilters({
        bodyRegions: [1],
        bodySystems: [],
        vindicateCategories: [],
        osteopathicModels: [],
        symptoms: [99], // No match
      });
      component.filterOverview();

      expect(component['filteredDiseases']()).toEqual([]);
    });
  });

  describe('openSidePanelDiseaseInformation', () => {
    it('should fetch extended disease and open side panel', async () => {
      const disease = mockDisease(1, 'Migräne');
      const extended = mockDiseaseExtended(disease);
      await initWithDiseases([disease]);

      component.openSidePanelDiseaseInformation(disease);
      httpTestingController.expectOne(`${API}/disease/1`).flush(extended);
      await fixture.whenStable();

      expect(component['selectedDisease']()).toEqual(extended);
      expect(mockSidePanelService.setSidePanelContent).toHaveBeenCalledOnce();
      expect(mockSidePanelService.open).toHaveBeenCalledOnce();
    });

    it('should show toast on fetch error', async () => {
      const disease = mockDisease(1, 'Migräne');
      await initWithDiseases([disease]);

      component.openSidePanelDiseaseInformation(disease);
      httpTestingController
        .expectOne(`${API}/disease/1`)
        .flush('Error', { status: 500, statusText: 'Internal Server Error' });
      await fixture.whenStable();

      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'danger',
          title: 'Informationen konnten nicht geladen werden',
        }),
      );
    });

    it('should update selectedDisease without reopening if panel is already open for disease', async () => {
      const disease1 = mockDisease(1, 'Migräne');
      const disease2 = mockDisease(2, 'Skoliose');
      await initWithDiseases([disease1, disease2]);

      // Open first disease
      component.openSidePanelDiseaseInformation(disease1);
      httpTestingController.expectOne(`${API}/disease/1`).flush(mockDiseaseExtended(disease1));
      await fixture.whenStable();

      // Simulate panel is open
      component['sidePanelOpen'] = true;

      // Open second disease — panel already open with 'disease' activePanel
      component.openSidePanelDiseaseInformation(disease2);
      httpTestingController.expectOne(`${API}/disease/2`).flush(mockDiseaseExtended(disease2));
      await fixture.whenStable();

      expect(component['selectedDisease']()!.id).toBe(2);
      // setSidePanelContent + open should only have been called once (for the first)
      expect(mockSidePanelService.setSidePanelContent).toHaveBeenCalledTimes(1);
      expect(mockSidePanelService.open).toHaveBeenCalledTimes(1);
    });
  });
});
