/* eslint-disable @typescript-eslint/dot-notation */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { vi } from 'vitest';

import { environment } from '../../../environments/environment';
import { DiseaseEditorComponent } from './disease-editor';

const API = environment.apiBaseUrl;

const mockToastService = {
  showToastNotification: vi.fn(),
};

const MOCK_BODY_REGIONS = [{ id: 1, name: 'Kopf' }];
const MOCK_BODY_SYSTEMS = [{ id: 2, name: 'Nervensystem' }];
const MOCK_VINDICATE_CATEGORIES = [{ id: 3, name: 'Vascular' }];
const MOCK_OSTEOPATHIC_MODELS = [{ id: 4, name: 'Biomechanisch' }];
const MOCK_SYMPTOMS = [{ id: 5, name: 'Schmerz' }];

describe('DiseaseEditorComponent', () => {
  let component: DiseaseEditorComponent;
  let fixture: ComponentFixture<DiseaseEditorComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    mockToastService.showToastNotification.mockClear();

    await TestBed.configureTestingModule({
      imports: [DiseaseEditorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SiToastNotificationService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseEditorComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  /** Flush the 5 init requests with mock data. */
  const flushInitRequests = () => {
    http.expectOne(`${API}/body-region`).flush(MOCK_BODY_REGIONS);
    http.expectOne(`${API}/body-system`).flush(MOCK_BODY_SYSTEMS);
    http.expectOne(`${API}/vindicate-category`).flush(MOCK_VINDICATE_CATEGORIES);
    http.expectOne(`${API}/osteopathic-model`).flush(MOCK_OSTEOPATHIC_MODELS);
    http.expectOne(`${API}/symptom`).flush(MOCK_SYMPTOMS);
  };

  /** Bootstrap the component and flush all init requests. */
  const init = async () => {
    fixture.detectChanges();
    flushInitRequests();
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
      fixture.detectChanges();
      http
        .expectOne(`${API}/body-region`)
        .flush('error', { status: 500, statusText: 'Server Error' });
      http.expectOne(`${API}/body-system`).flush(MOCK_BODY_SYSTEMS);
      http.expectOne(`${API}/vindicate-category`).flush(MOCK_VINDICATE_CATEGORIES);
      http.expectOne(`${API}/osteopathic-model`).flush(MOCK_OSTEOPATHIC_MODELS);
      http.expectOne(`${API}/symptom`).flush(MOCK_SYMPTOMS);
      await fixture.whenStable();

      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger' }),
      );
    });

    it('should still set optionsLoaded to true even when a request fails', async () => {
      fixture.detectChanges();
      http
        .expectOne(`${API}/body-region`)
        .flush('error', { status: 500, statusText: 'Server Error' });
      http.expectOne(`${API}/body-system`).flush([]);
      http.expectOne(`${API}/vindicate-category`).flush([]);
      http.expectOne(`${API}/osteopathic-model`).flush([]);
      http.expectOne(`${API}/symptom`).flush([]);
      await fixture.whenStable();

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
      http.expectNone(`${API}/disease`);
    });

    it('should not POST when form is valid but selections are empty', async () => {
      await init();
      fillForm();
      component['bodyRegionsSelected'] = [];
      component['submit']();
      http.expectNone(`${API}/disease`);
    });

    it('should not POST when selections are valid but form is invalid', async () => {
      await init();
      component['bodyRegionsSelected'] = [1];
      component['bodySystemsSelected'] = [2];
      component['vindicateCategoriesSelected'] = [3];
      component['osteopathicModelsSelected'] = [4];
      component['symptomsSelected'] = [5];
      component['submit']();
      http.expectNone(`${API}/disease`);
    });

    it('should not POST when already submitting', async () => {
      await init();
      fillForm();
      component['isSubmitting'].set(true);
      component['submit']();
      http.expectNone(`${API}/disease`);
    });
  });

  describe('submit() - successful POST', () => {
    it('should POST to /disease with the correct body', async () => {
      await init();
      fillForm();
      component['submit']();

      const req = http.expectOne(`${API}/disease`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
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
      req.flush({});
    });

    it('should set isSubmitting to true while the request is in flight', async () => {
      await init();
      fillForm();
      component['submit']();

      expect(component['isSubmitting']()).toBe(true);
      http.expectOne(`${API}/disease`).flush({});
      await fixture.whenStable();
    });

    it('should show a success toast after successful POST', async () => {
      await init();
      fillForm();
      component['submit']();

      http.expectOne(`${API}/disease`).flush({});
      await fixture.whenStable();

      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'success' }),
      );
    });

    it('should reset the form after successful POST', async () => {
      await init();
      fillForm();
      component['submit']();

      http.expectOne(`${API}/disease`).flush({});
      await fixture.whenStable();

      expect(component['form'].getRawValue().name).toBe('');
    });

    it('should clear all selections after successful POST', async () => {
      await init();
      fillForm();
      component['submit']();

      http.expectOne(`${API}/disease`).flush({});
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

      http.expectOne(`${API}/disease`).flush({});
      await fixture.whenStable();

      expect(component['submitted']()).toBe(false);
    });
  });

  describe('submit() - failed POST', () => {
    it('should show a danger toast when POST fails', async () => {
      await init();
      fillForm();
      component['submit']();

      http.expectOne(`${API}/disease`).flush('error', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(mockToastService.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger' }),
      );
    });

    it('should reset isSubmitting to false when POST fails', async () => {
      await init();
      fillForm();
      component['submit']();

      http.expectOne(`${API}/disease`).flush('error', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(component['isSubmitting']()).toBe(false);
    });

    it('should keep form values intact when POST fails', async () => {
      await init();
      fillForm();
      component['submit']();

      http.expectOne(`${API}/disease`).flush('error', { status: 500, statusText: 'Server Error' });
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
});
