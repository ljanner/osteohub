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
import {
  SiHeaderDropdownComponent,
  SiHeaderDropdownItemComponent,
  SiHeaderDropdownTriggerDirective,
} from '@siemens/element-ng/header-dropdown';
import { addIcons } from '@siemens/element-ng/icon';
import { SiSidePanelComponent } from '@siemens/element-ng/side-panel';
import { SiThemeService } from '@siemens/element-ng/theme';

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
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  private themeService = inject(SiThemeService);

  protected readonly darkTheme = signal(false);

  icons = addIcons({
    elementInfo,
    elementSun,
    elementEconomy,
    elementSettings,
    elementLogin,
    elementLogout,
  });

  constructor() {
    this.themeService.applyThemeType('auto');
    this.darkTheme.set(this.themeService.resolvedColorScheme === 'dark');
  }

  toggleTheme(): void {
    this.darkTheme.set(!this.darkTheme());
    this.themeService.applyThemeType(this.darkTheme() ? 'dark' : 'light');
  }
}
