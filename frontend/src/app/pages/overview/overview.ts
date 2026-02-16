/* eslint-disable @angular-eslint/no-experimental */
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { elementFilter, elementInfo } from '@siemens/element-icons';
import { SiEmptyStateComponent } from '@siemens/element-ng/empty-state';
import { addIcons, SiIconComponent } from '@siemens/element-ng/icon';
import { SiSearchBarComponent } from '@siemens/element-ng/search-bar';
import { SiSidePanelContentComponent, SiSidePanelService } from '@siemens/element-ng/side-panel';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';

import { environment } from '../../../environments/environment';
import { DiseaseCardComponent } from '../../components/disease-card/disease-card';
import { DiseaseDetailsComponent } from '../../components/disease-details/disease-details';
import type { Disease, DiseaseExtended } from '../../models/types';
import { FilterStateService } from '../../services/filter-state.service';
import { FilterPanelComponent } from './components/filter-panel/filter-panel';

@Component({
  selector: 'app-overview',
  imports: [
    DiseaseCardComponent,
    FilterPanelComponent,
    SiSearchBarComponent,
    SiIconComponent,
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
  private http = inject(HttpClient);
  private toastNotificationService = inject(SiToastNotificationService);
  private sidePanelService = inject(SiSidePanelService);
  private filterStateService = inject(FilterStateService);
  private destroyRef = inject(DestroyRef);
  protected sidePanelOpen = this.sidePanelService.isOpen();

  readonly filterSidePanelContent = viewChild.required('filter', { read: CdkPortal });
  readonly diseaseInformationSidePanelContent = viewChild.required('diseaseInformation', {
    read: CdkPortal,
  });

  protected readonly diseases = signal<Disease[] | null>(null);
  protected readonly selectedDisease = signal<DiseaseExtended | null>(null);
  private readonly activePanel = signal<'filter' | 'disease' | null>(null);

  icons = addIcons({
    elementFilter,
    elementInfo,
  });

  searchValue = new FormControl('', { nonNullable: true });

  constructor() {
    this.loadDiseases();
    this.searchValue.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filterOverview(this.searchValue.value));
    this.sidePanelService.isOpen$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isOpen) => (this.sidePanelOpen = isOpen));
  }

  loadDiseases(): void {
    this.diseases.set(null);
    this.http.get<Disease[]>(`${environment.apiBaseUrl}/disease`).subscribe({
      next: (response) => {
        this.diseases.set(response);
      },
      error: (_) => {
        this.diseases.set([]);
        this.toastNotificationService.showToastNotification({
          state: 'danger',
          title: 'Krankheiten konnten nicht geladen werden',
          message: 'Bitte versuchen Sie es später erneut.',
          timeout: 5000,
        });
      },
    });
  }

  filterOverview(searchTerm?: string): void {
    const filterSelection = this.filterStateService.selection();
    console.log('Filter overview with', filterSelection, 'and search term', searchTerm);
  }

  openSidePanelFilter(): void {
    if (this.sidePanelOpen && this.activePanel() === 'filter') {
      return;
    }

    this.sidePanelService.setSidePanelContent(this.filterSidePanelContent());
    this.activePanel.set('filter');
    this.sidePanelService.open();
  }

  openSidePanelDiseaseInformation(disease: Disease): void {
    this.http.get<DiseaseExtended>(`${environment.apiBaseUrl}/disease/${disease.id}`).subscribe({
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
