import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { elementInfo } from '@siemens/element-icons';
import { SiEmptyStateComponent } from '@siemens/element-ng/empty-state';
import { addIcons } from '@siemens/element-ng/icon';
import { SiSearchBarComponent } from '@siemens/element-ng/search-bar';
import { SiSidePanelContentComponent, SiSidePanelService } from '@siemens/element-ng/side-panel';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';

import { DiseaseCardComponent } from '../../components/disease-card/disease-card';
import { DiseaseDetailsComponent } from '../../components/disease-details/disease-details';
import type { Disease, DiseaseExtended, DiseaseRelationsIds } from '../../models/types';
import { DiseaseService } from '../../services/disease.service';
import { FilterStateService } from '../../services/filter-state.service';
import { FilterSelectionComponent } from './components/filter-selection/filter-selection';

@Component({
  selector: 'app-overview',
  imports: [
    DiseaseCardComponent,
    FilterSelectionComponent,
    SiSearchBarComponent,
    SiSidePanelContentComponent,
    SiEmptyStateComponent,
    ReactiveFormsModule,
    PortalModule,
    DiseaseDetailsComponent,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewComponent {
  private diseaseService = inject(DiseaseService);
  private toastNotificationService = inject(SiToastNotificationService);
  private sidePanelService = inject(SiSidePanelService);
  private filterStateService = inject(FilterStateService);
  private destroyRef = inject(DestroyRef);
  protected sidePanelOpen = this.sidePanelService.isOpen();

  readonly diseaseInformationSidePanelContent = viewChild.required('diseaseInformation', {
    read: CdkPortal,
  });

  private readonly allDiseases = signal<Disease[] | null>(null);
  protected readonly filteredDiseases = signal<Disease[] | null>(null);
  protected readonly dataState = signal<'loading' | 'ready' | 'empty' | 'error'>('loading');
  protected readonly selectedDisease = signal<DiseaseExtended | null>(null);
  private readonly activePanel = signal<'disease' | null>(null);

  icons = addIcons({
    elementInfo,
  });

  searchValue = new FormControl('', { nonNullable: true });

  constructor() {
    this.loadDiseases();
    this.searchValue.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filterOverview());
    this.sidePanelService.isOpen$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isOpen) => (this.sidePanelOpen = isOpen));
    this.destroyRef.onDestroy(() => this.sidePanelService.close());
  }

  loadDiseases(): void {
    this.dataState.set('loading');
    this.filteredDiseases.set(null);
    this.allDiseases.set(null);
    this.diseaseService.getAll().subscribe({
      next: (response) => {
        this.allDiseases.set(response);
        if (response.length === 0) {
          this.filteredDiseases.set([]);
          this.dataState.set('empty');
          return;
        }

        this.dataState.set('ready');
        this.filterOverview();
      },
      error: (_) => {
        this.filteredDiseases.set(null);
        this.allDiseases.set(null);
        this.dataState.set('error');
        this.toastNotificationService.showToastNotification({
          state: 'danger',
          title: 'Krankheiten konnten nicht geladen werden',
          message: 'Bitte versuchen Sie es später erneut.',
          timeout: 5000,
        });
      },
    });
  }

  filterOverview(): void {
    const allDiseases = this.allDiseases();
    if (allDiseases === null) {
      return;
    }

    const normalizedSearch = this.normalizeSearchTerm();
    const activeFilters = this.filterStateService.activeFilters();

    this.filteredDiseases.set(this.filterDiseases(allDiseases, normalizedSearch, activeFilters));
  }

  private normalizeSearchTerm(): string {
    return this.searchValue.value.trim().toLocaleLowerCase();
  }

  private filterDiseases(
    diseases: Disease[],
    normalizedSearch: string,
    activeFilters: DiseaseRelationsIds,
  ): Disease[] {
    return diseases.filter(
      (disease) =>
        this.matchesSearchTerm(disease, normalizedSearch) &&
        this.matchesCategoryFilters(disease, activeFilters),
    );
  }

  private matchesSearchTerm(disease: Disease, normalizedSearch: string): boolean {
    return (
      normalizedSearch.length === 0 ||
      disease.name.toLocaleLowerCase().includes(normalizedSearch) ||
      disease.description.toLocaleLowerCase().includes(normalizedSearch) ||
      disease.bodyRegions.some((bodyRegion) =>
        bodyRegion.name.toLocaleLowerCase().includes(normalizedSearch),
      ) ||
      disease.bodySystems.some((bodySystem) =>
        bodySystem.name.toLocaleLowerCase().includes(normalizedSearch),
      ) ||
      disease.vindicateCategories.some((vindicateCategory) =>
        vindicateCategory.name.toLocaleLowerCase().includes(normalizedSearch),
      ) ||
      disease.osteopathicModels.some((osteopathicModel) =>
        osteopathicModel.name.toLocaleLowerCase().includes(normalizedSearch),
      ) ||
      disease.symptoms.some((symptom) =>
        symptom.name.toLocaleLowerCase().includes(normalizedSearch),
      )
    );
  }

  private matchesCategoryFilters(disease: Disease, activeFilters: DiseaseRelationsIds): boolean {
    return (
      this.matchesSelection(disease.bodyRegions, activeFilters.bodyRegionIds) &&
      this.matchesSelection(disease.bodySystems, activeFilters.bodySystemIds) &&
      this.matchesSelection(disease.vindicateCategories, activeFilters.vindicateCategoryIds) &&
      this.matchesSelection(disease.osteopathicModels, activeFilters.osteopathicModelIds) &&
      this.matchesSelection(disease.symptoms, activeFilters.symptomIds)
    );
  }

  private matchesSelection(items: { id: number }[], selectedIds: number[]): boolean {
    if (selectedIds.length === 0) {
      return true;
    }

    return items.some((item) => selectedIds.includes(item.id));
  }

  openSidePanelDiseaseInformation(disease: Disease): void {
    this.diseaseService.getById(disease.id).subscribe({
      next: (response) => {
        this.selectedDisease.set(response);

        if (this.sidePanelOpen && this.activePanel() === 'disease') {
          return;
        }

        this.sidePanelService.setSidePanelContent(this.diseaseInformationSidePanelContent());
        this.activePanel.set('disease');
        this.sidePanelService.open();
      },
      error: (_) => {
        this.toastNotificationService.showToastNotification({
          state: 'danger',
          title: 'Informationen konnten nicht geladen werden',
          message: 'Bitte versuchen Sie es später erneut.',
          timeout: 5000,
        });
      },
    });
  }
}
