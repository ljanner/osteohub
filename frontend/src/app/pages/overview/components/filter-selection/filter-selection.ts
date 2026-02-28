import { NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, linkedSignal, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SiCollapsiblePanelComponent } from '@siemens/element-ng/accordion';
import { SiResizeObserverDirective } from '@siemens/element-ng/resize-observer';
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
  FilterCategories,
  VindicateCategory,
  OsteopathicModel,
  Symptom,
} from '../../../../models/types';
import { FilterStateService } from '../../../../services/filter-state.service';

const MOBILE_BREAKPOINT = 576;

@Component({
  selector: 'app-filter-selection',
  imports: [
    NgTemplateOutlet,
    SiCollapsiblePanelComponent,
    SiResizeObserverDirective,
    SiSelectComponent,
    SiSelectSimpleOptionsDirective,
    SiSelectMultiValueDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filter-selection.html',
  styleUrl: './filter-selection.scss',
})
export class FilterSelectionComponent implements OnInit {
  private http = inject(HttpClient);
  private toastNotificationService = inject(SiToastNotificationService);
  private filterStateService = inject(FilterStateService);
  private destroyRef = inject(DestroyRef);

  readonly filtersChanged = output<void>();
  protected readonly isMobile = signal<boolean>(false);

  protected bodyRegionsOptions: SelectItem<number>[] = [];
  protected bodySystemsOptions: SelectItem<number>[] = [];
  protected vindicateCategoriesOptions: SelectItem<number>[] = [];
  protected osteopathicModelsOptions: SelectItem<number>[] = [];
  protected symptomsOptions: SelectItem<number>[] = [];

  protected bodyRegionsSelected: number[] = [];
  protected bodySystemsSelected: number[] = [];
  protected vindicateCategoriesSelected: number[] = [];
  protected osteopathicModelsSelected: number[] = [];
  protected symptomsSelected: number[] = [];

  protected readonly hasActiveFilters = linkedSignal(() =>
    this.filterStateService.hasActiveFilters(),
  );

  constructor() {
    this.getActiveFilters();
  }

  /**
   * Loads the filter options from the API and initializes the select options.
   * If loading any of the filter categories fails, an error toast notification
   * is shown and the respective filter category is initialized with a disabled
   * option indicating that the filter options are not available.
   */
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

  protected onLayoutResize(event: Event | { width: number }): void {
    if (typeof event === 'object' && event !== null && 'width' in event) {
      this.isMobile.set(event.width <= MOBILE_BREAKPOINT);
    }
  }

  filterOverview(): void {
    const activeFilters: FilterCategories = {
      bodyRegions: this.bodyRegionsSelected,
      bodySystems: this.bodySystemsSelected,
      vindicateCategories: this.vindicateCategoriesSelected,
      osteopathicModels: this.osteopathicModelsSelected,
      symptoms: this.symptomsSelected,
    };

    this.filterStateService.setActiveFilters(activeFilters);
    this.filtersChanged.emit();
  }

  protected clearAllFilters(): void {
    this.filterStateService.clearActiveFilters();
    this.getActiveFilters();

    this.filtersChanged.emit();
  }

  private getActiveFilters(): void {
    const storedActiveFilters = this.filterStateService.activeFilters();

    this.bodyRegionsSelected = [...storedActiveFilters.bodyRegions];
    this.bodySystemsSelected = [...storedActiveFilters.bodySystems];
    this.vindicateCategoriesSelected = [...storedActiveFilters.vindicateCategories];
    this.osteopathicModelsSelected = [...storedActiveFilters.osteopathicModels];
    this.symptomsSelected = [...storedActiveFilters.symptoms];
  }
}
