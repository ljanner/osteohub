import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiFormItemComponent } from '@siemens/element-ng/form';
import {
  SiSelectComponent,
  SiSelectSimpleOptionsDirective,
  SiSelectMultiValueDirective,
  type SelectItem,
} from '@siemens/element-ng/select';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { catchError, forkJoin, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import type {
  BodyRegion,
  BodySystem,
  VindicateCategory,
  OsteopathicModel,
  Symptom,
} from '../../models/types';

@Component({
  selector: 'app-disease-editor',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    SiFormItemComponent,
    SiSelectComponent,
    SiSelectSimpleOptionsDirective,
    SiSelectMultiValueDirective,
  ],
  templateUrl: './disease-editor.html',
  styleUrl: './disease-editor.scss',
})
export class DiseaseEditorComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly toastNotificationService = inject(SiToastNotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isSubmitting = signal(false);
  protected readonly optionsLoaded = signal(false);
  protected readonly submitted = signal(false);

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

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    icd: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    frequency: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    etiology: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pathogenesis: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    redFlags: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    diagnostics: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    therapy: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    prognosis: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    osteopathicTreatment: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

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
          this.bodyRegionsOptions = bodyRegions.map((r) => ({
            type: 'option',
            label: r.name,
            value: r.id,
          }));
          this.bodySystemsOptions = bodySystems.map((s) => ({
            type: 'option',
            label: s.name,
            value: s.id,
          }));
          this.vindicateCategoriesOptions = vindicateCategories.map((c) => ({
            type: 'option',
            label: c.name,
            value: c.id,
          }));
          this.osteopathicModelsOptions = osteopathicModels.map((m) => ({
            type: 'option',
            label: m.name,
            value: m.id,
          }));
          this.symptomsOptions = symptoms.map((s) => ({
            type: 'option',
            label: s.name,
            value: s.id,
          }));
          this.optionsLoaded.set(true);

          if (hasLoadingError) {
            this.toastNotificationService.showToastNotification({
              state: 'danger',
              title: 'Kategorien konnten nicht vollständig geladen werden',
              message: 'Einige Auswahloptionen sind derzeit nicht verfügbar.',
              timeout: 5000,
            });
          }
        },
      );
  }
  protected selectionsValid(): boolean {
    return (
      this.bodyRegionsSelected.length > 0 &&
      this.bodySystemsSelected.length > 0 &&
      this.vindicateCategoriesSelected.length > 0 &&
      this.osteopathicModelsSelected.length > 0 &&
      this.symptomsSelected.length > 0
    );
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.selectionsValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const value = this.form.getRawValue();

    const body = {
      ...value,
      bodyRegionIds: this.bodyRegionsSelected,
      bodySystemIds: this.bodySystemsSelected,
      vindicateCategoryIds: this.vindicateCategoriesSelected,
      osteopathicModelIds: this.osteopathicModelsSelected,
      symptomIds: this.symptomsSelected,
    };

    this.http
      .post(`${environment.apiBaseUrl}/disease`, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastNotificationService.showToastNotification({
            state: 'success',
            title: 'Krankheit erstellt',
            message: `${value.name} wurde erfolgreich angelegt.`,
            timeout: 4000,
          });
          this.form.reset();
          this.bodyRegionsSelected = [];
          this.bodySystemsSelected = [];
          this.vindicateCategoriesSelected = [];
          this.osteopathicModelsSelected = [];
          this.symptomsSelected = [];
          this.submitted.set(false);
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.toastNotificationService.showToastNotification({
            state: 'danger',
            title: 'Fehler beim Erstellen',
            message:
              'Die Krankheit konnte nicht gespeichert werden. Bitte prüfen Sie Ihre Eingaben.',
            timeout: 5000,
          });
        },
      });
  }
}
