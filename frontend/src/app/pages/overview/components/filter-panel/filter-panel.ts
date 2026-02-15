import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import {
  SiSelectComponent,
  SiSelectSimpleOptionsDirective,
  SiSelectMultiValueDirective,
  type SelectItem,
} from '@siemens/element-ng/select';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { catchError, forkJoin, of } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import type {
  BodyRegion,
  BodySystem,
  FilterSelection,
  VindicateCategory,
  OsteopathicModel,
  Symptom,
} from '../../../../models/types';
import { FilterStateService } from '../../../../services/filter-state.service';

@Component({
  selector: 'app-filter-panel',
  imports: [
    SiSelectComponent,
    SiSelectSimpleOptionsDirective,
    SiSelectMultiValueDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanelComponent implements OnInit {
  private http = inject(HttpClient);
  private toastNotificationService = inject(SiToastNotificationService);
  private filterStateService = inject(FilterStateService);
  private destroyRef = inject(DestroyRef);

  readonly filtersChanged = output<void>();

  protected bodyRegionsOptions: SelectItem<number>[] = [];
  protected bodyRegionsSelected: number[] = [];
  protected bodySystemsOptions: SelectItem<number>[] = [];
  protected bodySystemsSelected: number[] = [];
  protected vindicateCategoriesOptions: SelectItem<number>[] = [];
  protected vindicateCategoriesSelected: number[] = [];
  protected osteopathicModelsOptions: SelectItem<number>[] = [];
  protected osteopathicModelsSelected: number[] = [];
  protected symptomsOptions: SelectItem<number>[] = [];
  protected symptomsSelected: number[] = [];

  constructor() {
    const storedSelection = this.filterStateService.selection();

    this.bodyRegionsSelected = [...storedSelection.bodyRegions];
    this.bodySystemsSelected = [...storedSelection.bodySystems];
    this.vindicateCategoriesSelected = [...storedSelection.vindicateCategories];
    this.osteopathicModelsSelected = [...storedSelection.osteopathicModels];
    this.symptomsSelected = [...storedSelection.symptoms];
  }

  ngOnInit(): void {
    let hasLoadingError = false;

    forkJoin({
      bodyRegions: this.http.get<BodyRegion[]>(`${environment.apiBaseUrl}/body-region`).pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as BodyRegion[]);
        }),
      ),
      bodySystems: this.http.get<BodySystem[]>(`${environment.apiBaseUrl}/body-system`).pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as BodySystem[]);
        }),
      ),
      vindicateCategories: this.http
        .get<VindicateCategory[]>(`${environment.apiBaseUrl}/vindicate-category`)
        .pipe(
          catchError(() => {
            hasLoadingError = true;
            return of([] as VindicateCategory[]);
          }),
        ),
      osteopathicModels: this.http
        .get<OsteopathicModel[]>(`${environment.apiBaseUrl}/osteopathic-model`)
        .pipe(
          catchError(() => {
            hasLoadingError = true;
            return of([] as OsteopathicModel[]);
          }),
        ),
      symptoms: this.http.get<Symptom[]>(`${environment.apiBaseUrl}/symptom`).pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as Symptom[]);
        }),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        ({ bodyRegions, bodySystems, vindicateCategories, osteopathicModels, symptoms }) => {
          if (bodyRegions.length === 0) {
            this.bodyRegionsOptions = [
              {
                type: 'option',
                label: 'Keine Körperregionen verfügbar',
                value: -1,
                disabled: true,
              },
            ];
          } else {
            this.bodyRegionsOptions = bodyRegions.map((region) => ({
              type: 'option',
              label: region.name,
              value: region.id,
            }));
          }
          if (bodySystems.length === 0) {
            this.bodySystemsOptions = [
              { type: 'option', label: 'Keine Körpersysteme verfügbar', value: -1, disabled: true },
            ];
          } else {
            this.bodySystemsOptions = bodySystems.map((system) => ({
              type: 'option',
              label: system.name,
              value: system.id,
            }));
          }
          if (vindicateCategories.length === 0) {
            this.vindicateCategoriesOptions = [
              {
                type: 'option',
                label: 'Keine VINDICATE-Kategorien verfügbar',
                value: -1,
                disabled: true,
              },
            ];
          } else {
            this.vindicateCategoriesOptions = vindicateCategories.map((category) => ({
              type: 'option',
              label: category.name,
              value: category.id,
            }));
          }
          if (osteopathicModels.length === 0) {
            this.osteopathicModelsOptions = [
              {
                type: 'option',
                label: 'Keine osteopathischen Modelle verfügbar',
                value: -1,
                disabled: true,
              },
            ];
          } else {
            this.osteopathicModelsOptions = osteopathicModels.map((model) => ({
              type: 'option',
              label: model.name,
              value: model.id,
            }));
          }
          if (symptoms.length === 0) {
            this.symptomsOptions = [
              { type: 'option', label: 'Keine Symptome verfügbar', value: -1, disabled: true },
            ];
          } else {
            this.symptomsOptions = symptoms.map((symptom) => ({
              type: 'option',
              label: symptom.name,
              value: symptom.id,
            }));
          }

          if (hasLoadingError) {
            this.toastNotificationService.showToastNotification({
              state: 'danger',
              title: 'Filter konnten nicht vollständig geladen werden',
              message: 'Einige Filteroptionen sind derzeit nicht verfügbar.',
              timeout: 5000,
            });
          }
        },
      );
  }

  filterOverview(): void {
    const selection: FilterSelection = {
      bodyRegions: this.bodyRegionsSelected,
      bodySystems: this.bodySystemsSelected,
      vindicateCategories: this.vindicateCategoriesSelected,
      osteopathicModels: this.osteopathicModelsSelected,
      symptoms: this.symptomsSelected,
    };

    this.filterStateService.setSelection(selection);
    this.filtersChanged.emit();
  }
}
