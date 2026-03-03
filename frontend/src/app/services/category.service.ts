import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import type {
  BodyRegion,
  BodySystem,
  DiseaseRelations,
  OsteopathicModel,
  Symptom,
  VindicateCategory,
} from '../models/types';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  getBodyRegions(): Observable<BodyRegion[]> {
    return this.http.get<BodyRegion[]>(`${this.base}/body-region`);
  }

  getBodySystems(): Observable<BodySystem[]> {
    return this.http.get<BodySystem[]>(`${this.base}/body-system`);
  }

  getVindicateCategories(): Observable<VindicateCategory[]> {
    return this.http.get<VindicateCategory[]>(`${this.base}/vindicate-category`);
  }

  getOsteopathicModels(): Observable<OsteopathicModel[]> {
    return this.http.get<OsteopathicModel[]>(`${this.base}/osteopathic-model`);
  }

  getSymptoms(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(`${this.base}/symptom`);
  }

  getAllCategories(): Observable<DiseaseRelations> {
    return forkJoin({
      bodyRegions: this.getBodyRegions(),
      bodySystems: this.getBodySystems(),
      vindicateCategories: this.getVindicateCategories(),
      osteopathicModels: this.getOsteopathicModels(),
      symptoms: this.getSymptoms(),
    });
  }
}
