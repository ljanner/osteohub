import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, output } from '@angular/core';
import { elementEdit, elementDelete } from '@siemens/element-icons';
import { SiActionDialogService } from '@siemens/element-ng/action-modal';
import { SiCardComponent } from '@siemens/element-ng/card';
import {
  SiContentActionBarComponent,
  type ContentActionBarMainItem,
} from '@siemens/element-ng/content-action-bar';
import { addIcons } from '@siemens/element-ng/icon';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';

import { environment } from '../../../environments/environment';
import type { Disease } from '../../models/types';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-disease-card',
  imports: [SiContentActionBarComponent, SiCardComponent],
  templateUrl: './disease-card.html',
  styleUrl: './disease-card.scss',
  host: {
    '[class.loading]': 'disease() === null',
  },
})
export class DiseaseCardComponent {
  private http = inject(HttpClient);
  private toastService = inject(SiToastNotificationService);
  private siModal = inject(SiActionDialogService);
  protected authService = inject(AuthService);

  readonly disease = input<Disease | null>(null);
  readonly deleted = output<void>();

  protected readonly maxBadgeCount = 5;

  icons = addIcons({
    elementDelete,
    elementEdit,
  });

  protected primaryItems: ContentActionBarMainItem[] = [
    {
      type: 'action',
      label: 'Löschen',
      icon: this.icons.elementDelete,
      action: () => this.deleteDisease(),
    },
  ];

  private deleteDisease(): void {
    const disease = this.disease();
    if (!disease) return;

    this.siModal
      .showActionDialog({
        type: 'delete-confirm',
        heading: 'Krankheit löschen',
        message: `${disease.name} löschen?`,
      })
      .subscribe((result) => {
        if (result !== 'delete') return;

        this.http.delete(`${environment.apiBaseUrl}/disease/${disease.id}`).subscribe({
          next: () => {
            this.toastService.showToastNotification({
              state: 'success',
              title: 'Krankheit gelöscht',
              message: `${disease.name} wurde erfolgreich gelöscht.`,
              timeout: 5000,
            });
            this.deleted.emit();
          },
          error: (err: HttpErrorResponse) => {
            const message =
              err.status === 401 || err.status === 403
                ? 'Sie haben keine Berechtigung, diese Krankheit zu löschen.'
                : 'Beim Löschen ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.';

            this.toastService.showToastNotification({
              state: 'danger',
              title: 'Löschen fehlgeschlagen',
              message,
              timeout: 5000,
            });
          },
        });
      });
  }

  protected getVisibleBadges(): { key: string; name: string; className: string }[] {
    const disease = this.disease();

    if (!disease) {
      return [];
    }

    const allBadges = [
      ...disease.osteopathicModels.map((model) => ({
        key: `model-${model.id}`,
        name: model.name,
        className: 'bg-success-emphasis',
      })),
      ...disease.vindicateCategories.map((category) => ({
        key: `category-${category.id}`,
        name: category.name,
        className: 'bg-info-emphasis',
      })),
      ...disease.symptoms.map((symptom) => ({
        key: `symptom-${symptom.id}`,
        name: symptom.name,
        className: 'bg-secondary',
      })),
    ];

    return allBadges.slice(0, this.maxBadgeCount);
  }

  protected getHiddenBadgeCount(): number {
    const disease = this.disease();

    if (!disease) {
      return 0;
    }

    const totalBadgeCount =
      disease.osteopathicModels.length +
      disease.vindicateCategories.length +
      disease.symptoms.length;

    return Math.max(0, totalBadgeCount - this.maxBadgeCount);
  }
}
