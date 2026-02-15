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
import { catchError, forkJoin, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import type {
  BodyRegion,
  BodySystem,
  FilterSelection,
  VindicateCategory,
  OsteopathicModel,
  Symptom,
} from '../../models/types';
import { FilterStateService } from '../../services/filter-state.service';

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
  private filterStateService = inject(FilterStateService);
  private destroyRef = inject(DestroyRef);

  readonly filtersChanged = output<FilterSelection>();

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
    forkJoin({
      bodyRegions: this.http
        .get<BodyRegion[]>(`${environment.apiBaseUrl}/body-region`)
        .pipe(catchError(() => of([] as BodyRegion[]))),
      bodySystems: this.http
        .get<BodySystem[]>(`${environment.apiBaseUrl}/body-system`)
        .pipe(catchError(() => of([] as BodySystem[]))),
      vindicateCategories: this.http
        .get<VindicateCategory[]>(`${environment.apiBaseUrl}/vindicate-category`)
        .pipe(catchError(() => of([] as VindicateCategory[]))),
      osteopathicModels: this.http
        .get<OsteopathicModel[]>(`${environment.apiBaseUrl}/osteopathic-model`)
        .pipe(catchError(() => of([] as OsteopathicModel[]))),
      symptoms: this.http
        .get<Symptom[]>(`${environment.apiBaseUrl}/symptom`)
        .pipe(catchError(() => of([] as Symptom[]))),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        ({ bodyRegions, bodySystems, vindicateCategories, osteopathicModels, symptoms }) => {
          this.bodyRegionsOptions = bodyRegions.map((region) => ({
            type: 'option',
            label: region.name,
            value: region.id,
          }));
          this.bodySystemsOptions = bodySystems.map((system) => ({
            type: 'option',
            label: system.name,
            value: system.id,
          }));
          this.vindicateCategoriesOptions = vindicateCategories.map((category) => ({
            type: 'option',
            label: category.name,
            value: category.id,
          }));
          this.osteopathicModelsOptions = osteopathicModels.map((model) => ({
            type: 'option',
            label: model.name,
            value: model.id,
          }));
          this.symptomsOptions = symptoms.map((symptom) => ({
            type: 'option',
            label: symptom.name,
            value: symptom.id,
          }));
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
    this.filtersChanged.emit(selection);
  }
}
