/* eslint-disable @typescript-eslint/dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiSidePanelService } from '@siemens/element-ng/side-panel';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import type { Disease, DiseaseExtended } from '../../models/types';
import { CategoryService } from '../../services/category.service';
import { DiseaseService } from '../../services/disease.service';
import { FilterStateService } from '../../services/filter-state.service';
import { OverviewComponent } from './overview';

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
  isOpen: () => false,
  isOpen$,
  open: vi.fn(),
  close: vi.fn(),
  setSidePanelContent: vi.fn(),
};

const mockDiseaseService = {
  getAll: vi.fn(),
  getById: vi.fn(),
};

const mockCategoryService = {
  getBodyRegions: vi.fn().mockReturnValue(of([])),
  getBodySystems: vi.fn().mockReturnValue(of([])),
  getVindicateCategories: vi.fn().mockReturnValue(of([])),
  getOsteopathicModels: vi.fn().mockReturnValue(of([])),
  getSymptoms: vi.fn().mockReturnValue(of([])),
};

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let filterStateService: FilterStateService;
  let diseaseSubject: Subject<Disease[]>;

  beforeEach(async () => {
    diseaseSubject = new Subject<Disease[]>();
    mockToastService.showToastNotification.mockClear();
    mockSidePanelService.open.mockClear();
    mockSidePanelService.close.mockClear();
    mockSidePanelService.setSidePanelContent.mockClear();
    // Return a Subject so the constructor subscription doesn't resolve until the
    // test controls it via diseaseSubject.next() / .error()
    mockDiseaseService.getAll.mockReturnValue(diseaseSubject.asObservable());
    mockDiseaseService.getById.mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [
        { provide: DiseaseService, useValue: mockDiseaseService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: SiToastNotificationService, useValue: mockToastService },
        { provide: SiSidePanelService, useValue: mockSidePanelService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    filterStateService = TestBed.inject(FilterStateService);
  });

  /** Emit diseases from the subject and run change detection. */
  const initWithDiseases = async (diseases: Disease[]) => {
    fixture.detectChanges();
    diseaseSubject.next(diseases);
    diseaseSubject.complete();
    await fixture.whenStable();
  };

  /** Emit an error from the subject and run change detection. */
  const initWithError = async () => {
    fixture.detectChanges();
    diseaseSubject.error(new Error('Server Error'));
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
      mockDiseaseService.getAll.mockReturnValue(of([]));
      component.loadDiseases();
      fixture.detectChanges();
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
      // Do not detectChanges — allDiseases is null
      component.filterOverview();
      expect(component['filteredDiseases']()).toBeNull();
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
        bodyRegionIds: [1],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
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
        bodyRegionIds: [1],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
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
            { id: 2, name: 'Gefässsystem' },
          ],
        },
      ];
      await initWithDiseases(diseases);

      filterStateService.setActiveFilters({
        bodyRegionIds: [],
        bodySystemIds: [2],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [],
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
        bodyRegionIds: [1],
        bodySystemIds: [],
        vindicateCategoryIds: [],
        osteopathicModelIds: [],
        symptomIds: [99], // No match
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

      mockDiseaseService.getById.mockReturnValue(of(extended));
      component.openSidePanelDiseaseInformation(disease);
      await fixture.whenStable();

      expect(component['selectedDisease']()).toEqual(extended);
      expect(mockSidePanelService.setSidePanelContent).toHaveBeenCalledOnce();
      expect(mockSidePanelService.open).toHaveBeenCalledOnce();
    });

    it('should call getById with the correct disease id', async () => {
      const disease = mockDisease(7, 'Arthrose');
      await initWithDiseases([disease]);

      mockDiseaseService.getById.mockReturnValue(of(mockDiseaseExtended(disease)));
      component.openSidePanelDiseaseInformation(disease);
      await fixture.whenStable();

      expect(mockDiseaseService.getById).toHaveBeenCalledWith(7);
    });

    it('should show toast on fetch error', async () => {
      const disease = mockDisease(1, 'Migräne');
      await initWithDiseases([disease]);

      mockDiseaseService.getById.mockReturnValue(throwError(() => new Error('Server Error')));
      component.openSidePanelDiseaseInformation(disease);
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
      mockDiseaseService.getById.mockReturnValue(of(mockDiseaseExtended(disease1)));
      component.openSidePanelDiseaseInformation(disease1);
      await fixture.whenStable();

      // Simulate panel is open
      component['sidePanelOpen'] = true;

      // Open second disease — panel already open with 'disease' activePanel
      mockDiseaseService.getById.mockReturnValue(of(mockDiseaseExtended(disease2)));
      component.openSidePanelDiseaseInformation(disease2);
      await fixture.whenStable();

      expect(component['selectedDisease']()!.id).toBe(2);
      // setSidePanelContent + open should only have been called once (for the first)
      expect(mockSidePanelService.setSidePanelContent).toHaveBeenCalledTimes(1);
      expect(mockSidePanelService.open).toHaveBeenCalledTimes(1);
    });
  });
});
