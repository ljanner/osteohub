import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { elementDelete, elementEdit, elementPlus } from '@siemens/element-icons';
import { SiActionDialogService } from '@siemens/element-ng/action-modal';
import {
  ContentActionBarMainItem,
  SiContentActionBarComponent,
} from '@siemens/element-ng/content-action-bar';
import { addIcons } from '@siemens/element-ng/icon';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';

import { environment } from '../../../../environments/environment';

type Category = { id: number; name: string };

@Component({
  selector: 'app-category-list',
  imports: [SiContentActionBarComponent, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent implements OnInit {
  readonly label = input.required<string>();
  readonly apiPath = input.required<string>();

  private http = inject(HttpClient);
  private toastService = inject(SiToastNotificationService);
  private dialogService = inject(SiActionDialogService);

  protected readonly items = signal<Category[]>([]);
  protected readonly editingId = signal<number | null>(null);
  protected readonly editingName = signal('');
  protected readonly newName = signal('');

  protected readonly icons = addIcons({ elementEdit, elementDelete, elementPlus });

  protected readonly itemActionMap = computed(
    () =>
      new Map<number, ContentActionBarMainItem[]>(
        this.items().map((item) => [
          item.id,
          [
            {
              type: 'action',
              label: 'Bearbeiten',
              icon: this.icons.elementEdit,
              iconOnly: true,
              action: () => this.startEdit(item),
            },
            {
              type: 'action',
              label: 'Löschen',
              icon: this.icons.elementDelete,
              iconOnly: true,
              action: () => this.deleteItem(item),
            },
          ],
        ]),
      ),
  );

  ngOnInit(): void {
    this.loadItems();
  }

  protected loadItems(): void {
    this.http.get<Category[]>(`${environment.apiBaseUrl}${this.apiPath()}`).subscribe({
      next: (items) => this.items.set(items),
      error: () =>
        this.toastService.showToastNotification({
          state: 'danger',
          title: 'Fehler',
          message: `${this.label()} konnten nicht geladen werden.`,
        }),
    });
  }

  protected startEdit(item: Category): void {
    this.editingId.set(item.id);
    this.editingName.set(item.name);
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected saveEdit(): void {
    const id = this.editingId();
    const name = this.editingName().trim();
    if (!id || !name) return;

    this.http
      .patch<Category>(`${environment.apiBaseUrl}${this.apiPath()}/${id}`, { name })
      .subscribe({
        next: (updated) => {
          this.items.update((list) =>
            list
              .map((i) => (i.id === id ? updated : i))
              .sort((a, b) => a.name.localeCompare(b.name)),
          );
          this.editingId.set(null);
          this.toastService.showToastNotification({
            state: 'success',
            title: 'Gespeichert',
            message: `${name} wurde aktualisiert.`,
            timeout: 4000,
          });
        },
        error: (err: HttpErrorResponse) =>
          this.toastService.showToastNotification({
            state: 'danger',
            title: 'Fehler',
            message:
              err.status === 401 || err.status === 403
                ? 'Keine Berechtigung.'
                : 'Speichern fehlgeschlagen. Bitte erneut versuchen.',
          }),
      });
  }

  protected deleteItem(item: Category): void {
    this.dialogService
      .showActionDialog({
        type: 'delete-confirm',
        heading: `${this.label()} löschen`,
        message: `"${item.name}" löschen? Alle bestehenden Verbindungen zu Krankheiten werden entfernt.`,
      })
      .subscribe((result) => {
        if (result === 'delete') {
          this.http
            .delete<Category>(`${environment.apiBaseUrl}${this.apiPath()}/${item.id}`)
            .subscribe({
              next: () => {
                this.items.update((list) => list.filter((i) => i.id !== item.id));
                this.toastService.showToastNotification({
                  state: 'success',
                  title: 'Gelöscht',
                  message: `${item.name} wurde gelöscht.`,
                  timeout: 4000,
                });
              },
              error: (err: HttpErrorResponse) =>
                this.toastService.showToastNotification({
                  state: 'danger',
                  title: 'Fehler',
                  message:
                    err.status === 401 || err.status === 403
                      ? 'Keine Berechtigung.'
                      : 'Löschen fehlgeschlagen. Bitte erneut versuchen.',
                }),
            });
        }
      });
  }

  protected addItem(): void {
    const name = this.newName().trim();
    if (!name) return;

    this.http.post<Category>(`${environment.apiBaseUrl}${this.apiPath()}`, { name }).subscribe({
      next: (created) => {
        this.items.update((list) =>
          [...list, created].sort((a, b) => a.name.localeCompare(b.name)),
        );
        this.newName.set('');

        this.toastService.showToastNotification({
          state: 'success',
          title: 'Erstellt',
          message: `${name} wurde erstellt.`,
          timeout: 4000,
        });
      },
      error: (err: HttpErrorResponse) =>
        this.toastService.showToastNotification({
          state: 'danger',
          title: 'Fehler',
          message:
            err.status === 401 || err.status === 403
              ? 'Keine Berechtigung.'
              : 'Erstellen fehlgeschlagen. Bitte erneut versuchen.',
        }),
    });
  }
}
