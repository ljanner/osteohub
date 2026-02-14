/* eslint-disable @angular-eslint/no-experimental */
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { elementFilter } from '@siemens/element-icons';
import { addIcons, SiIconComponent } from '@siemens/element-ng/icon';
import { SiSearchBarComponent } from '@siemens/element-ng/search-bar';

import { environment } from '../../../environments/environment';
import { SidePanelService } from '../../services/side-panel.service';

@Component({
  selector: 'app-overview',
  imports: [SiSearchBarComponent, SiIconComponent, JsonPipe, ReactiveFormsModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewComponent {
  private http = inject(HttpClient);
  public sidePanelService = inject(SidePanelService);

  icons = addIcons({
    elementFilter,
  });

  searchValue = new FormControl('');

  getSymptoms() {
    this.http.get(environment.apiBaseUrl + '/symptoms').subscribe(console.log);
  }

  constructor() {
    this.searchValue.valueChanges.subscribe(() => console.log(this.searchValue.value));
  }

  openFilters(): void {
    this.sidePanelService.open('Filter');
  }
}
