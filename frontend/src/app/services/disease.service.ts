import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import type { Disease, DiseaseExtended, DiseaseWriteBody } from '../models/types';

@Injectable({ providedIn: 'root' })
export class DiseaseService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/disease`;

  getAll(): Observable<Disease[]> {
    return this.http.get<Disease[]>(this.base);
  }

  getById(id: number): Observable<DiseaseExtended> {
    return this.http.get<DiseaseExtended>(`${this.base}/${id}`);
  }

  create(body: DiseaseWriteBody): Observable<DiseaseExtended> {
    return this.http.post<DiseaseExtended>(this.base, body);
  }

  update(id: number, body: DiseaseWriteBody): Observable<DiseaseExtended> {
    return this.http.put<DiseaseExtended>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
