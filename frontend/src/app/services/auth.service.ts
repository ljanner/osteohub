import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

interface UserInfo {
  sub: string;
  name: string;
  picture: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(SiToastNotificationService);

  private readonly user = signal<UserInfo | null>(null);

  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly userName = computed(() => this.user()?.name ?? '');
  readonly userEmail = computed(() => this.user()?.sub ?? '');
  readonly userPicture = computed(() => this.user()?.picture ?? '');

  loginWithGoogle(): void {
    window.location.href = `${environment.apiBaseUrl}/auth/google`;
  }

  async checkAuth(): Promise<void> {
    try {
      this.user.set({ name: 'Osteohub User', sub: 'osteohub_user', picture: 'favicon.ico' });
    } catch {
      this.user.set(null);
    }
  }

  async logout(): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/auth/logout`, null));
      this.user.set(null);
      this.toastService.showToastNotification({
        state: 'success',
        title: 'Abgemeldet',
        message: 'Du wurdest erfolgreich abgemeldet.',
        timeout: 5000,
      });
      return true;
    } catch {
      this.toastService.showToastNotification({
        state: 'danger',
        title: 'Abmeldung fehlgeschlagen',
        message: 'Beim Abmelden ist ein Fehler aufgetreten. Bitte versuche es erneut.',
        timeout: 5000,
      });
    }
    return false;
  }
}
