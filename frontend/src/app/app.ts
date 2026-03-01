import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  elementInfo,
  elementSun,
  elementEconomy,
  elementSettings,
  elementLogin,
  elementLogout,
} from '@siemens/element-icons';
import {
  SiAccountDetailsComponent,
  SiApplicationHeaderComponent,
  SiHeaderAccountItemComponent,
  SiHeaderActionItemComponent,
  SiHeaderActionsDirective,
  SiHeaderBrandDirective,
  SiHeaderNavigationComponent,
  SiHeaderNavigationItemComponent,
} from '@siemens/element-ng/application-header';
import {
  SiHeaderDropdownComponent,
  SiHeaderDropdownItemComponent,
  SiHeaderDropdownTriggerDirective,
} from '@siemens/element-ng/header-dropdown';
import { addIcons } from '@siemens/element-ng/icon';
import { SiSidePanelComponent } from '@siemens/element-ng/side-panel';
import { SiThemeService } from '@siemens/element-ng/theme';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    SiApplicationHeaderComponent,
    SiAccountDetailsComponent,
    SiHeaderAccountItemComponent,
    SiHeaderDropdownComponent,
    SiHeaderDropdownItemComponent,
    SiHeaderDropdownTriggerDirective,
    SiHeaderBrandDirective,
    SiHeaderActionsDirective,
    SiHeaderActionItemComponent,
    SiHeaderNavigationComponent,
    SiHeaderNavigationItemComponent,
    SiSidePanelComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  private themeService = inject(SiThemeService);
  private router = inject(Router);
  protected readonly authService = inject(AuthService);

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

  login(): void {
    this.authService.loginWithGoogle();
  }

  async logout(): Promise<void> {
    if (await this.authService.logout()) {
      this.router.navigate(['/overview']);
    }
  }
}
