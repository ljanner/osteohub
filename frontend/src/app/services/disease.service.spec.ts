import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { DiseaseService } from './disease.service';

const API = `${environment.apiBaseUrl}/disease`;

const MOCK_DISEASE = {
  id: 1,
  name: 'Arthrose',
  description: 'Degenerative Gelenkerkrankung',
  bodyRegions: [],
  bodySystems: [],
  vindicateCategories: [],
  osteopathicModels: [],
  symptoms: [],
};

const MOCK_DISEASE_EXTENDED = {
  ...MOCK_DISEASE,
  icd: 'M15-M19',
  frequency: 'Sehr häufig',
  etiology: 'Multifaktoriell',
  pathogenesis: 'Knorpeldegeneration',
  redFlags: 'Plötzliche Schwellung',
  diagnostics: 'Röntgen',
  therapy: 'Physiotherapie',
  prognosis: 'Chronisch',
  osteopathicTreatment: 'Parietale Techniken',
};

const MOCK_WRITE_BODY = {
  name: 'Arthrose',
  icd: 'M15-M19',
  description: 'Degenerative Gelenkerkrankung',
  frequency: 'Sehr häufig',
  etiology: 'Multifaktoriell',
  pathogenesis: 'Knorpeldegeneration',
  redFlags: 'Plötzliche Schwellung',
  diagnostics: 'Röntgen',
  therapy: 'Physiotherapie',
  prognosis: 'Chronisch',
  osteopathicTreatment: 'Parietale Techniken',
  bodyRegionIds: [1],
  bodySystemIds: [2],
  vindicateCategoryIds: [3],
  osteopathicModelIds: [4],
  symptomIds: [5],
};

describe('DiseaseService', () => {
  let service: DiseaseService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DiseaseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  describe('getAll()', () => {
    it('should GET /disease', () => {
      let result: unknown;
      service.getAll().subscribe((r) => (result = r));

      const req = http.expectOne(API);
      expect(req.request.method).toBe('GET');
      req.flush([MOCK_DISEASE]);

      expect(result).toEqual([MOCK_DISEASE]);
    });

    it('should return an empty array when the API returns no diseases', () => {
      let result: unknown;
      service.getAll().subscribe((r) => (result = r));

      http.expectOne(API).flush([]);

      expect(result).toEqual([]);
    });
  });

  describe('getById()', () => {
    it('should GET /disease/:id', () => {
      let result: unknown;
      service.getById(1).subscribe((r) => (result = r));

      const req = http.expectOne(`${API}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_DISEASE_EXTENDED);

      expect(result).toEqual(MOCK_DISEASE_EXTENDED);
    });

    it('should use the provided id in the URL', () => {
      service.getById(42).subscribe();
      http.expectOne(`${API}/42`).flush(MOCK_DISEASE_EXTENDED);
    });
  });

  describe('create()', () => {
    it('should POST to /disease with the given body', () => {
      let result: unknown;
      service.create(MOCK_WRITE_BODY).subscribe((r) => (result = r));

      const req = http.expectOne(API);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(MOCK_WRITE_BODY);
      req.flush(MOCK_DISEASE_EXTENDED);

      expect(result).toEqual(MOCK_DISEASE_EXTENDED);
    });
  });

  describe('update()', () => {
    it('should PUT to /disease/:id with the given body', () => {
      let result: unknown;
      service.update(1, MOCK_WRITE_BODY).subscribe((r) => (result = r));

      const req = http.expectOne(`${API}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(MOCK_WRITE_BODY);
      req.flush(MOCK_DISEASE_EXTENDED);

      expect(result).toEqual(MOCK_DISEASE_EXTENDED);
    });

    it('should use the provided id in the URL', () => {
      service.update(99, MOCK_WRITE_BODY).subscribe();
      http.expectOne(`${API}/99`).flush(MOCK_DISEASE_EXTENDED);
    });
  });

  describe('delete()', () => {
    it('should DELETE /disease/:id', () => {
      let completed = false;
      service.delete(1).subscribe({ complete: () => (completed = true) });

      const req = http.expectOne(`${API}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(completed).toBe(true);
    });

    it('should use the provided id in the URL', () => {
      service.delete(7).subscribe();
      http.expectOne(`${API}/7`).flush(null);
    });
  });
});
