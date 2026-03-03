import { Component, DestroyRef, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SiFormItemComponent } from '@siemens/element-ng/form';
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
  VindicateCategory,
  OsteopathicModel,
  Symptom,
} from '../../models/types';
import { CategoryService } from '../../services/category.service';
import { DiseaseService } from '../../services/disease.service';

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
  private readonly diseaseService = inject(DiseaseService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastNotificationService = inject(SiToastNotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isSubmitting = signal(false);
  protected readonly optionsLoaded = signal(false);
  protected readonly submitted = signal(false);
  protected readonly editDiseaseId = signal<number | null>(null);
  protected readonly isEditMode = computed(() => this.editDiseaseId() !== null);

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
    const routeDiseaseId = this.parseDiseaseId(this.route.snapshot.paramMap.get('id'));
    if (routeDiseaseId === 'invalid') {
      this.toastNotificationService.showToastNotification({
        state: 'danger',
        title: 'Ungültige Krankheit',
        message: 'Die angeforderte Krankheit konnte nicht geladen werden.',
        timeout: 5000,
      });
      void this.router.navigate(['/overview']);
      return;
    }

    this.editDiseaseId.set(routeDiseaseId);

    let hasLoadingError = false;
    let diseaseLoadingFailed = false;

    forkJoin({
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
      disease:
        routeDiseaseId === null
          ? of(null)
          : this.diseaseService.getById(routeDiseaseId).pipe(
              catchError(() => {
                diseaseLoadingFailed = true;
                return of(null);
              }),
            ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        ({
          bodyRegions,
          bodySystems,
          vindicateCategories,
          osteopathicModels,
          symptoms,
          disease,
        }) => {
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

          if (disease) {
            this.form.patchValue({
              name: disease.name,
              icd: disease.icd,
              description: disease.description,
              frequency: disease.frequency,
              etiology: disease.etiology,
              pathogenesis: disease.pathogenesis,
              redFlags: disease.redFlags,
              diagnostics: disease.diagnostics,
              therapy: disease.therapy,
              prognosis: disease.prognosis,
              osteopathicTreatment: disease.osteopathicTreatment,
            });

            this.bodyRegionsSelected = disease.bodyRegions.map((region) => region.id);
            this.bodySystemsSelected = disease.bodySystems.map((system) => system.id);
            this.vindicateCategoriesSelected = disease.vindicateCategories.map(
              (category) => category.id,
            );
            this.osteopathicModelsSelected = disease.osteopathicModels.map((model) => model.id);
            this.symptomsSelected = disease.symptoms.map((symptom) => symptom.id);
          }

          this.optionsLoaded.set(true);

          if (hasLoadingError) {
            this.toastNotificationService.showToastNotification({
              state: 'danger',
              title: 'Kategorien konnten nicht vollständig geladen werden',
              message: 'Einige Auswahloptionen sind derzeit nicht verfügbar.',
              timeout: 5000,
            });
          }

          if (diseaseLoadingFailed) {
            this.toastNotificationService.showToastNotification({
              state: 'danger',
              title: 'Krankheit konnte nicht geladen werden',
              message: 'Die Bearbeitung ist derzeit nicht möglich.',
              timeout: 5000,
            });
            void this.router.navigate(['/overview']);
          }
        },
      );
  }

  private parseDiseaseId(rawDiseaseId: string | null): number | null | 'invalid' {
    if (rawDiseaseId === null) {
      return null;
    }

    const parsedDiseaseId = Number.parseInt(rawDiseaseId, 10);
    if (Number.isNaN(parsedDiseaseId) || parsedDiseaseId <= 0) {
      return 'invalid';
    }

    return parsedDiseaseId;
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
    const formValue = this.form.getRawValue();

    const requestBody = {
      ...formValue,
      bodyRegionIds: this.bodyRegionsSelected,
      bodySystemIds: this.bodySystemsSelected,
      vindicateCategoryIds: this.vindicateCategoriesSelected,
      osteopathicModelIds: this.osteopathicModelsSelected,
      symptomIds: this.symptomsSelected,
    };

    const diseaseId = this.editDiseaseId();
    const saveRequest =
      diseaseId === null
        ? this.diseaseService.create(requestBody)
        : this.diseaseService.update(diseaseId, requestBody);

    saveRequest.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toastNotificationService.showToastNotification({
          state: 'success',
          title: diseaseId === null ? 'Krankheit erstellt' : 'Krankheit aktualisiert',
          message:
            diseaseId === null
              ? `${formValue.name} wurde erfolgreich angelegt.`
              : `${formValue.name} wurde erfolgreich aktualisiert.`,
          timeout: 4000,
        });

        if (diseaseId === null) {
          this.form.reset();
          this.bodyRegionsSelected = [];
          this.bodySystemsSelected = [];
          this.vindicateCategoriesSelected = [];
          this.osteopathicModelsSelected = [];
          this.symptomsSelected = [];
        }

        this.submitted.set(false);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toastNotificationService.showToastNotification({
          state: 'danger',
          title: diseaseId === null ? 'Fehler beim Erstellen' : 'Fehler beim Aktualisieren',
          message: 'Die Krankheit konnte nicht gespeichert werden. Bitte prüfen Sie Ihre Eingaben.',
          timeout: 5000,
        });
      },
    });
  }
}
