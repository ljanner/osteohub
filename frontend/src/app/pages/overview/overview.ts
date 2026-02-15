/* eslint-disable @angular-eslint/no-experimental */
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Component, inject, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { elementFilter } from '@siemens/element-icons';
import { addIcons, SiIconComponent } from '@siemens/element-ng/icon';
import { SiSearchBarComponent } from '@siemens/element-ng/search-bar';
import { SiSidePanelContentComponent, SiSidePanelService } from '@siemens/element-ng/side-panel';

import { environment } from '../../../environments/environment';
import { DiseaseCardComponent } from '../../components/disease-card/disease-card';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel';
import type { Disease, DiseaseExtended, FilterSelection } from '../../models/types';

@Component({
  selector: 'app-overview',
  imports: [
    DiseaseCardComponent,
    FilterPanelComponent,
    SiSearchBarComponent,
    SiIconComponent,
    SiSidePanelContentComponent,
    ReactiveFormsModule,
    PortalModule,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewComponent {
  private http = inject(HttpClient);
  private sidePanelService = inject(SiSidePanelService);
  protected sidePanelOpen = this.sidePanelService.isOpen();

  readonly filterSidePanelContent = viewChild.required('filter', { read: CdkPortal });
  readonly diseaseInformationSidePanelContent = viewChild.required('diseaseInformation', {
    read: CdkPortal,
  });

  protected readonly diseases: Disease[] = [
    {
      id: 1,
      name: 'Lumbar Disc Herniation',
      description:
        'Protrusion of the intervertebral disc in the lumbar spine causing nerve root irritation.',
      bodyRegions: [
        { id: 1, name: 'Lumbar Spine' },
        { id: 2, name: 'Lower Extremity' },
      ],
      bodySystems: [
        { id: 1, name: 'Musculoskeletal System' },
        { id: 2, name: 'Nervous System' },
      ],
      vindicateCategories: [
        { id: 1, name: 'Traumatic' },
        { id: 2, name: 'Degenerative' },
      ],
      osteopathicModels: [
        { id: 1, name: 'Biomechanical Model' },
        { id: 2, name: 'Neurological Model' },
      ],
      symptoms: [
        { id: 1, name: 'Lower back pain' },
        { id: 2, name: 'Radicular leg pain' },
        { id: 3, name: 'Numbness' },
      ],
    },
    {
      id: 2,
      name: 'Tension-Type Headache',
      description: 'Primary headache characterized by bilateral pressing or tightening pain.',
      bodyRegions: [
        { id: 3, name: 'Head' },
        { id: 4, name: 'Cervical Spine' },
      ],
      bodySystems: [
        { id: 3, name: 'Nervous System' },
        { id: 4, name: 'Musculoskeletal System' },
      ],
      vindicateCategories: [{ id: 3, name: 'Idiopathic' }],
      osteopathicModels: [
        { id: 3, name: 'Respiratory-Circulatory Model' },
        { id: 1, name: 'Biomechanical Model' },
      ],
      symptoms: [
        { id: 1, name: 'Lower back pain' },
        { id: 2, name: 'Radicular leg pain' },
        { id: 3, name: 'Numbness' },
        { id: 4, name: 'Bilateral head pain' },
        { id: 5, name: 'Neck stiffness' },
        { id: 6, name: 'Pressure sensation' },
      ],
    },
    {
      id: 1,
      name: 'Lumbar Disc Herniation',
      description:
        'Protrusion of the intervertebral disc in the lumbar spine causing nerve root irritation.',
      bodyRegions: [
        { id: 1, name: 'Lumbar Spine' },
        { id: 2, name: 'Lower Extremity' },
      ],
      bodySystems: [{ id: 1, name: 'Musculoskeletal System' }],
      vindicateCategories: [{ id: 1, name: 'Traumatic' }],
      osteopathicModels: [{ id: 1, name: 'Biomechanical Model' }],
      symptoms: [{ id: 1, name: 'Lower back pain' }],
    },
  ];
  protected selectedDisease: DiseaseExtended | null = null;

  icons = addIcons({
    elementFilter,
  });

  searchValue = new FormControl('');

  constructor() {
    this.searchValue.valueChanges.subscribe(() => console.log(this.searchValue.value));
    this.sidePanelService.isOpen$.subscribe((isOpen) => (this.sidePanelOpen = isOpen));

    this.http.get<Disease[]>(`${environment.apiBaseUrl}/disease`).subscribe({
      next: (response) => {
        console.log('Diseases:', response);
      },
    });
  }

  filterOverview(event: FilterSelection): void {
    console.log('Filter overview with', event);
  }

  openSidePanelFilter(): void {
    this.sidePanelService.setSidePanelContent(this.filterSidePanelContent());
    this.sidePanelService.open();
  }

  openSidePanelDiseaseInformation(disease: Disease): void {
    console.log('Open disease information for disease ID:', disease.id);
    this.http.get<DiseaseExtended>(`${environment.apiBaseUrl}/disease/${disease.id}`).subscribe({
      next: (response) => {
        this.selectedDisease = response;
        this.sidePanelService.setSidePanelContent(this.diseaseInformationSidePanelContent());
        this.sidePanelService.open();
      },
      error: (error) => {
        console.error('Error fetching disease information:', error);
      },
    });
  }
}
