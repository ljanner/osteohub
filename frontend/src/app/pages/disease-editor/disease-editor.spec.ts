/* eslint-disable @typescript-eslint/dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { CategoryService } from '../../services/category.service';
import { DiseaseService } from '../../services/disease.service';
import { DiseaseEditorComponent } from './disease-editor';

const mockToastService = {
  showToastNotification: vi.fn(),
};

const MOCK_BODY_REGIONS = [{ id: 1, name: 'Kopf' }];
const MOCK_BODY_SYSTEMS = [{ id: 2, name: 'Nervensystem' }];
const MOCK_VINDICATE_CATEGORIES = [{ id: 3, name: 'Vascular' }];
const MOCK_OSTEOPATHIC_MODELS = [{ id: 4, name: 'Biomechanisch' }];
const MOCK_SYMPTOMS = [{ id: 5, name: 'Schmerz' }];
const MOCK_EXISTING_DISEASE = {
  id: 42,
  name: 'Lumbalgie',
  icd: 'M54.5',
  description: 'Schmerzen im unteren Rücken',
  frequency: 'Häufig',
  etiology: 'Multifaktoriell',
  pathogenesis: 'Muskuloskelettale Dysfunktion',
  redFlags: 'Trauma, Fieber, Lähmung',
  diagnostics: 'Anamnese und klinische Untersuchung',
  therapy: 'Bewegungstherapie',
  prognosis: 'Meist gut',
  osteopathicTreatment: 'Parietale und viszerale Techniken',
  bodyRegions: [{ id: 1, name: 'Kopf' }],
  bodySystems: [{ id: 2, name: 'Nervensystem' }],
  vindicateCategories: [{ id: 3, name: 'Vascular' }],
  osteopathicModels: [{ id: 4, name: 'Biomechanisch' }],
  symptoms: [{ id: 5, name: 'Schmerz' }],
};

const createActivatedRoute = (id: string | null) => ({
  snapshot: {
    paramMap: convertToParamMap(id === null ? {} : { id }),
  },
});

describe('DiseaseEditorComponent', () => {
  let component: DiseaseEditorComponent;
  let fixture: ComponentFixture<DiseaseEditorComponent>;

  const mockDiseaseService = {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockCategoryService = {
    getBodyRegions: vi.fn().mockReturnValue(of(MOCK_BODY_REGIONS)),
    getBodySystems: vi.fn().mockReturnValue(of(MOCK_BODY_SYSTEMS)),
    getVindicateCategories: vi.fn().mockReturnValue(of(MOCK_VINDICATE_CATEGORIES)),
    getOsteopathicModels: vi.fn().mockReturnValue(of(MOCK_OSTEOPATHIC_MODELS)),
    getSymptoms: vi.fn().mockReturnValue(of(MOCK_SYMPTOMS)),
  };

  beforeEach(async () => {
    mockToastService.showToastNotification.mockClear();
    mockDiseaseService.getById.mockReturnValue(of(null));
    mockDiseaseService.create.mockReturnValue(of({}));
    mockDiseaseService.update.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [DiseaseEditorComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: createActivatedRoute(null) },
        { provide: SiToastNotificationService, useValue: mockToastService },
        { provide: DiseaseService, useValue: mockDiseaseService },
        { provide: CategoryService, useValue: mockCategoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseEditorComponent);
    component = fixture.componentInstance;
  });

  /** Bootstrap the component (detectChanges triggers ngOnInit). */
  const init = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  /** Fill all reactive form controls with valid values. */
  const fillForm = () => {
    component['form'].setValue({
      name: 'Migräne',
      icd: 'G43',
      description: 'Halbseitiger Kopfschmerz',
      frequency: 'Häufig',
      etiology: 'Genetisch',
      pathogenesis: 'Neurogene Entzündung',
      redFlags: 'Donnerclap headache',
      diagnostics: 'MRT, EEG',
      therapy: 'Triptane',
      prognosis: 'Gut',
      osteopathicTreatment: 'Kraniosacrales Arbeiten',
    });
    component['bodyRegionsSelected'] = [1];
    component['bodySystemsSelected'] = [2];
    component['vindicateCategoriesSelected'] = [3];
    component['osteopathicModelsSelected'] = [4];
    component['symptomsSelected'] = [5];
  };

  it('should create', async () => {
    await init();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - loading options', () => {
    it('should map body region options from API response', async () => {
      await init();
      expect(component['bodyRegionsOptions']).toEqual([
        { type: 'option', label: 'Kopf', value: 1 },
      ]);
    });

    it('should map all 5 option sets', async () => {
      await init();
      expect(component['bodySystemsOptions']).toHaveLength(1);
      expect(component['vindicateCategoriesOptions']).toHaveLength(1);
      expect(component['osteopathicModelsOptions']).toHaveLength(1);
      expect(component['symptomsOptions']).toHaveLength(1);
    });

    it('should set optionsLoaded to true after fetching', async () => {
      await init();
      expect(component['optionsLoaded']()).toBe(true);
    });

    it('should show a danger toast when any init request fails', async () => {
      mockCategoryService.getBodyRegions.mockReturnValue(
        throwError(() => new Error('Server Error')),
      );
      await init();

      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger' }),
      );
    });

    it('should still set optionsLoaded to true even when a request fails', async () => {
      mockCategoryService.getBodyRegions.mockReturnValue(
        throwError(() => new Error('Server Error')),
      );
      await init();

      expect(component['optionsLoaded']()).toBe(true);
    });
  });

  describe('submit() - initial signal state', () => {
    it('should have submitted as false initially', async () => {
      await init();
      expect(component['submitted']()).toBe(false);
    });

    it('should have isSubmitting as false initially', async () => {
      await init();
      expect(component['isSubmitting']()).toBe(false);
    });
  });

  describe('submit() - form validation', () => {
    it('should set submitted to true when form is submitted', async () => {
      await init();
      component['submit']();
      expect(component['submitted']()).toBe(true);
    });

    it('should call markAllAsTouched on the form when submitted', async () => {
      await init();
      const spy = vi.spyOn(component['form'], 'markAllAsTouched');
      component['submit']();
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not POST when form controls are empty', async () => {
      await init();
      component['submit']();
      expect(mockDiseaseService.create).not.toHaveBeenCalled();
    });

    it('should not POST when form is valid but selections are empty', async () => {
      await init();
      fillForm();
      component['bodyRegionsSelected'] = [];
      component['submit']();
      expect(mockDiseaseService.create).not.toHaveBeenCalled();
    });

    it('should not POST when selections are valid but form is invalid', async () => {
      await init();
      component['bodyRegionsSelected'] = [1];
      component['bodySystemsSelected'] = [2];
      component['vindicateCategoriesSelected'] = [3];
      component['osteopathicModelsSelected'] = [4];
      component['symptomsSelected'] = [5];
      component['submit']();
      expect(mockDiseaseService.create).not.toHaveBeenCalled();
    });

    it('should not POST when already submitting', async () => {
      await init();
      fillForm();
      component['isSubmitting'].set(true);
      component['submit']();
      expect(mockDiseaseService.create).not.toHaveBeenCalled();
    });
  });

  describe('submit() - successful POST', () => {
    it('should POST to /disease with the correct body', async () => {
      await init();
      fillForm();
      component['submit']();

      expect(mockDiseaseService.create).toHaveBeenCalledWith({
        name: 'Migräne',
        icd: 'G43',
        description: 'Halbseitiger Kopfschmerz',
        frequency: 'Häufig',
        etiology: 'Genetisch',
        pathogenesis: 'Neurogene Entzündung',
        redFlags: 'Donnerclap headache',
        diagnostics: 'MRT, EEG',
        therapy: 'Triptane',
        prognosis: 'Gut',
        osteopathicTreatment: 'Kraniosacrales Arbeiten',
        bodyRegionIds: [1],
        bodySystemIds: [2],
        vindicateCategoryIds: [3],
        osteopathicModelIds: [4],
        symptomIds: [5],
      });
    });

    it('should set isSubmitting to true while the request is in flight', async () => {
      const subject = new Subject<object>();
      mockDiseaseService.create.mockReturnValue(subject.asObservable());
      await init();
      fillForm();
      component['submit']();

      expect(component['isSubmitting']()).toBe(true);
      subject.next({});
      subject.complete();
      await fixture.whenStable();
    });

    it('should show a success toast after successful POST', async () => {
      await init();
      fillForm();
      component['submit']();
      await fixture.whenStable();

      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'success' }),
      );
    });

    it('should reset the form after successful POST', async () => {
      await init();
      fillForm();
      component['submit']();
      await fixture.whenStable();

      expect(component['form'].getRawValue().name).toBe('');
    });

    it('should clear all selections after successful POST', async () => {
      await init();
      fillForm();
      component['submit']();
      await fixture.whenStable();

      expect(component['bodyRegionsSelected']).toEqual([]);
      expect(component['bodySystemsSelected']).toEqual([]);
      expect(component['vindicateCategoriesSelected']).toEqual([]);
      expect(component['osteopathicModelsSelected']).toEqual([]);
      expect(component['symptomsSelected']).toEqual([]);
    });

    it('should reset submitted to false after successful POST', async () => {
      await init();
      fillForm();
      component['submit']();
      await fixture.whenStable();

      expect(component['submitted']()).toBe(false);
    });
  });

  describe('submit() - failed POST', () => {
    it('should show a danger toast when POST fails', async () => {
      mockDiseaseService.create.mockReturnValue(
        throwError(() => ({ status: 500, statusText: 'Server Error' })),
      );
      await init();
      fillForm();
      component['submit']();
      await fixture.whenStable();

      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger' }),
      );
    });

    it('should reset isSubmitting to false when POST fails', async () => {
      mockDiseaseService.create.mockReturnValue(
        throwError(() => ({ status: 500, statusText: 'Server Error' })),
      );
      await init();
      fillForm();
      component['submit']();
      await fixture.whenStable();

      expect(component['isSubmitting']()).toBe(false);
    });

    it('should keep form values intact when POST fails', async () => {
      mockDiseaseService.create.mockReturnValue(
        throwError(() => ({ status: 500, statusText: 'Server Error' })),
      );
      await init();
      fillForm();
      component['submit']();
      await fixture.whenStable();

      expect(component['form'].getRawValue().name).toBe('Migräne');
    });
  });

  describe('selectionsValid()', () => {
    it('should return true when all selections are non-empty', async () => {
      await init();
      component['bodyRegionsSelected'] = [1];
      component['bodySystemsSelected'] = [2];
      component['vindicateCategoriesSelected'] = [3];
      component['osteopathicModelsSelected'] = [4];
      component['symptomsSelected'] = [5];
      expect(component['selectionsValid']()).toBe(true);
    });

    it.each([
      ['bodyRegionsSelected'],
      ['bodySystemsSelected'],
      ['vindicateCategoriesSelected'],
      ['osteopathicModelsSelected'],
      ['symptomsSelected'],
    ] as const)('should return false when %s is empty', async (field) => {
      await init();
      component['bodyRegionsSelected'] = [1];
      component['bodySystemsSelected'] = [2];
      component['vindicateCategoriesSelected'] = [3];
      component['osteopathicModelsSelected'] = [4];
      component['symptomsSelected'] = [5];
      component[field] = [];
      expect(component['selectionsValid']()).toBe(false);
    });
  });

  describe('edit mode', () => {
    const setupWithRouteId = async (routeId: string | null) => {
      await TestBed.resetTestingModule();
      mockToastService.showToastNotification.mockClear();
      mockDiseaseService.create.mockClear();
      mockDiseaseService.update.mockReturnValue(of({}));

      await TestBed.configureTestingModule({
        imports: [DiseaseEditorComponent],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: createActivatedRoute(routeId) },
          { provide: SiToastNotificationService, useValue: mockToastService },
          { provide: DiseaseService, useValue: mockDiseaseService },
          { provide: CategoryService, useValue: mockCategoryService },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DiseaseEditorComponent);
      component = fixture.componentInstance;
    };

    it('should load disease details and prefill form in edit mode', async () => {
      await setupWithRouteId('42');
      mockDiseaseService.getById.mockReturnValue(of(MOCK_EXISTING_DISEASE));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component['isEditMode']()).toBe(true);
      expect(component['editDiseaseId']()).toBe(42);
      expect(component['form'].getRawValue().name).toBe('Lumbalgie');
      expect(component['bodyRegionsSelected']).toEqual([1]);
      expect(component['bodySystemsSelected']).toEqual([2]);
      expect(component['vindicateCategoriesSelected']).toEqual([3]);
      expect(component['osteopathicModelsSelected']).toEqual([4]);
      expect(component['symptomsSelected']).toEqual([5]);
    });

    it('should PUT /disease/:id with the correct body in edit mode', async () => {
      await setupWithRouteId('42');
      mockDiseaseService.getById.mockReturnValue(of(MOCK_EXISTING_DISEASE));

      fixture.detectChanges();
      await fixture.whenStable();

      component['form'].patchValue({ name: 'Lumbalgie akut' });
      component['submit']();

      expect(mockDiseaseService.update).toHaveBeenCalledWith(42, {
        name: 'Lumbalgie akut',
        icd: 'M54.5',
        description: 'Schmerzen im unteren Rücken',
        frequency: 'Häufig',
        etiology: 'Multifaktoriell',
        pathogenesis: 'Muskuloskelettale Dysfunktion',
        redFlags: 'Trauma, Fieber, Lähmung',
        diagnostics: 'Anamnese und klinische Untersuchung',
        therapy: 'Bewegungstherapie',
        prognosis: 'Meist gut',
        osteopathicTreatment: 'Parietale und viszerale Techniken',
        bodyRegionIds: [1],
        bodySystemIds: [2],
        vindicateCategoryIds: [3],
        osteopathicModelIds: [4],
        symptomIds: [5],
      });
    });

    it('should not reset form fields after successful PUT', async () => {
      await setupWithRouteId('42');
      mockDiseaseService.getById.mockReturnValue(of(MOCK_EXISTING_DISEASE));

      fixture.detectChanges();
      await fixture.whenStable();

      component['form'].patchValue({ name: 'Persistenter Name' });
      component['submit']();
      await fixture.whenStable();

      expect(component['form'].getRawValue().name).toBe('Persistenter Name');
      expect(component['bodyRegionsSelected']).toEqual([1]);
    });

    it('should navigate to overview when route id is invalid', async () => {
      await setupWithRouteId('invalid-id');
      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(navigateSpy).toHaveBeenCalledWith(['/overview']);
      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'danger',
          title: 'Ungültige Krankheit',
        }),
      );
    });
  });
});
