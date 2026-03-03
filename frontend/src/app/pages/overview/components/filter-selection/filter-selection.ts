import { NgTemplateOutlet } from '@angular/common';
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

import type {
  BodyRegion,
  BodySystem,
  DiseaseRelationsIds,
  VindicateCategory,
  OsteopathicModel,
  Symptom,
} from '../../../../models/types';
import { CategoryService } from '../../../../services/category.service';
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
  private categoryService = inject(CategoryService);
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

  protected bodyRegionIdsSelected: number[] = [];
  protected bodySystemIdsSelected: number[] = [];
  protected vindicateCategoryIdsSelected: number[] = [];
  protected osteopathicModelIdsSelected: number[] = [];
  protected symptomIdsSelected: number[] = [];

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

    const categories$ = {
      bodyRegions: this.categoryService.getBodyRegions().pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as BodyRegion[]);
        }),
      ),
      bodySystems: this.categoryService.getBodySystems().pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as BodySystem[]);
        }),
      ),
      vindicateCategories: this.categoryService.getVindicateCategories().pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as VindicateCategory[]);
        }),
      ),
      osteopathicModels: this.categoryService.getOsteopathicModels().pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as OsteopathicModel[]);
        }),
      ),
      symptoms: this.categoryService.getSymptoms().pipe(
        catchError(() => {
          hasLoadingError = true;
          return of([] as Symptom[]);
        }),
      ),
    };

    forkJoin(categories$)
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
    const activeFilters: DiseaseRelationsIds = {
      bodyRegionIds: this.bodyRegionIdsSelected,
      bodySystemIds: this.bodySystemIdsSelected,
      vindicateCategoryIds: this.vindicateCategoryIdsSelected,
      osteopathicModelIds: this.osteopathicModelIdsSelected,
      symptomIds: this.symptomIdsSelected,
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

    this.bodyRegionIdsSelected = [...storedActiveFilters.bodyRegionIds];
    this.bodySystemIdsSelected = [...storedActiveFilters.bodySystemIds];
    this.vindicateCategoryIdsSelected = [...storedActiveFilters.vindicateCategoryIds];
    this.osteopathicModelIdsSelected = [...storedActiveFilters.osteopathicModelIds];
    this.symptomIdsSelected = [...storedActiveFilters.symptomIds];
  }
}
