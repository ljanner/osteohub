import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SiInlineNotificationComponent } from '@siemens/element-ng/inline-notification';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [SiInlineNotificationComponent],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected errorMessage: string | null = null;

  private readonly errorMessages: Record<string, string> = {
    auth_denied: 'Anmeldung wurde abgebrochen.',
    token_exchange_failed: 'Authentifizierung fehlgeschlagen.',
    userinfo_failed: 'Benutzerinformationen konnten nicht abgerufen werden.',
    not_allowed: 'Dieses Konto ist nicht berechtigt.',
    server_error: 'Ein Serverfehler ist aufgetreten.',
  };

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      this.errorMessage = this.errorMessages[error] ?? 'Ein unbekannter Fehler ist aufgetreten.';
      return;
    }

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/overview']);
    }
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
