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

import { SidePanelService } from './services/side-panel.service';

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
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  private sidePanelService = inject(SidePanelService);
  private themeService = inject(SiThemeService);

  protected collapsed = this.sidePanelService.collapsed;
  protected readonly darkTheme = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

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
  }

  close(): void {
    this.sidePanelService.close();
  }

  toggleTheme(): void {
    this.darkTheme.set(!this.darkTheme());
    this.themeService.applyThemeType(this.darkTheme() ? 'dark' : 'light');
  }
}
