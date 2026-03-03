import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { CategoryService } from './category.service';

const BASE = environment.apiBaseUrl;

describe('CategoryService', () => {
  let service: CategoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify({ ignoreCancelled: true });
  });

  describe('getBodyRegions()', () => {
    it('should GET /body-region', () => {
      let result: unknown;
      service.getBodyRegions().subscribe((r) => (result = r));

      const req = http.expectOne(`${BASE}/body-region`);
      expect(req.request.method).toBe('GET');
      req.flush([{ id: 1, name: 'Kopf' }]);

      expect(result).toEqual([{ id: 1, name: 'Kopf' }]);
    });
  });

  describe('getBodySystems()', () => {
    it('should GET /body-system', () => {
      service.getBodySystems().subscribe();
      http.expectOne(`${BASE}/body-system`).flush([]);
    });
  });

  describe('getVindicateCategories()', () => {
    it('should GET /vindicate-category', () => {
      service.getVindicateCategories().subscribe();
      http.expectOne(`${BASE}/vindicate-category`).flush([]);
    });
  });

  describe('getOsteopathicModels()', () => {
    it('should GET /osteopathic-model', () => {
      service.getOsteopathicModels().subscribe();
      http.expectOne(`${BASE}/osteopathic-model`).flush([]);
    });
  });

  describe('getSymptoms()', () => {
    it('should GET /symptom', () => {
      service.getSymptoms().subscribe();
      http.expectOne(`${BASE}/symptom`).flush([]);
    });
  });

  describe('getAllCategories()', () => {
    const flushAll = () => {
      http.expectOne(`${BASE}/body-region`).flush([{ id: 1, name: 'Kopf' }]);
      http.expectOne(`${BASE}/body-system`).flush([{ id: 2, name: 'Nervensystem' }]);
      http.expectOne(`${BASE}/vindicate-category`).flush([{ id: 3, name: 'Vascular' }]);
      http.expectOne(`${BASE}/osteopathic-model`).flush([{ id: 4, name: 'Biomechanisch' }]);
      http.expectOne(`${BASE}/symptom`).flush([{ id: 5, name: 'Schmerz' }]);
    };

    it('should fire GET requests for all 5 category endpoints in parallel', () => {
      service.getAllCategories().subscribe();
      flushAll();
    });

    it('should combine results into a single DiseaseRelations object', () => {
      let result: unknown;
      service.getAllCategories().subscribe((r) => (result = r));
      flushAll();

      expect(result).toEqual({
        bodyRegions: [{ id: 1, name: 'Kopf' }],
        bodySystems: [{ id: 2, name: 'Nervensystem' }],
        vindicateCategories: [{ id: 3, name: 'Vascular' }],
        osteopathicModels: [{ id: 4, name: 'Biomechanisch' }],
        symptoms: [{ id: 5, name: 'Schmerz' }],
      });
    });

    it('should fail the observable if any single request fails', () => {
      let errorThrown = false;
      service.getAllCategories().subscribe({ error: () => (errorThrown = true) });

      http.expectOne(`${BASE}/body-region`).flush('error', { status: 500, statusText: 'Error' });

      // forkJoin unsubscribes remaining requests on first error — assert they were cancelled
      const cancelled = [
        ...http.match(`${BASE}/body-system`),
        ...http.match(`${BASE}/vindicate-category`),
        ...http.match(`${BASE}/osteopathic-model`),
        ...http.match(`${BASE}/symptom`),
      ];
      expect(cancelled).toHaveLength(4);
      cancelled.forEach((req) => expect(req.cancelled).toBe(true));

      expect(errorThrown).toBe(true);
    });
  });
});
