import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  elementInfo,
  elementSun,
  elementEconomy,
  elementSettings,
  elementLogin,
  elementLogout,
} from '@siemens/element-icons';
import {
  SiApplicationHeaderComponent,
  SiHeaderActionItemComponent,
  SiHeaderActionsDirective,
  SiHeaderBrandDirective,
} from '@siemens/element-ng/application-header';
import { SiEmptyStateComponent } from '@siemens/element-ng/empty-state';
import {
  SiHeaderDropdownComponent,
  SiHeaderDropdownItemComponent,
  SiHeaderDropdownTriggerDirective,
} from '@siemens/element-ng/header-dropdown';
import { addIcons } from '@siemens/element-ng/icon';
import { SiSidePanelComponent, SiSidePanelContentComponent } from '@siemens/element-ng/side-panel';
import { SiThemeService } from '@siemens/element-ng/theme';
import { catchError, map, of } from 'rxjs';

import { environment } from '../environments/environment';
import type { Filter } from './models/filter';
import { SidePanelService } from './services/side-panel.service';

type ApiResponse<T> = {
  ok: boolean;
  data: T;
};

const emptyFilters: Filter = {
  bodyRegions: [],
  bodySystems: [],
  vindicateCategories: [],
  osteopathicModels: [],
  symptoms: [],
};

@Component({
  selector: 'app-root',
  imports: [
    SiApplicationHeaderComponent,
    SiHeaderDropdownComponent,
    SiHeaderDropdownItemComponent,
    SiHeaderDropdownTriggerDirective,
    SiHeaderBrandDirective,
    SiHeaderActionsDirective,
    SiHeaderActionItemComponent,
    SiSidePanelComponent,
    SiSidePanelContentComponent,
    SiEmptyStateComponent,
    RouterLink,
    RouterOutlet,
    JsonPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  protected sidePanelService = inject(SidePanelService);
  private themeService = inject(SiThemeService);
  private http = inject(HttpClient);

  protected collapsed = this.sidePanelService.collapsed;
  protected readonly darkTheme = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);
  protected readonly filters = signal<Filter | null>(null);

  icons = addIcons({
    elementInfo,
    elementSun,
    elementEconomy,
    elementSettings,
    elementLogin,
    elementLogout,
  });

  constructor() {
    this.themeService.applyThemeType(this.darkTheme() ? 'dark' : 'light');
    this.http
      .get<ApiResponse<Filter>>(environment.apiBaseUrl + '/filters')
      .pipe(
        map((response) => response.data),
        catchError(() => of(emptyFilters)),
      )
      .subscribe((filters) => this.filters.set(filters));
  }

  close(): void {
    this.sidePanelService.close();
  }

  toggleTheme(): void {
    this.darkTheme.set(!this.darkTheme());
    this.themeService.applyThemeType(this.darkTheme() ? 'dark' : 'light');
  }
}
