/* eslint-disable @typescript-eslint/dot-notation */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiActionDialogService } from '@siemens/element-ng/action-modal';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { environment } from '../../../../environments/environment';
import { CategoryListComponent } from './category-list';

const API = environment.apiBaseUrl;
const API_PATH = '/body-region';
const LABEL = 'Körperregionen';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let http: HttpTestingController;

  const mockToast = { showToastNotification: vi.fn() };
  const mockDialog = { showActionDialog: vi.fn() };

  beforeEach(async () => {
    mockToast.showToastNotification.mockClear();
    mockDialog.showActionDialog.mockClear();

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SiToastNotificationService, useValue: mockToast },
        { provide: SiActionDialogService, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    fixture.componentRef.setInput('label', LABEL);
    fixture.componentRef.setInput('apiPath', API_PATH);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  /** detectChanges, flush the initial GET, stabilise. */
  const init = async (
    items = [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
    ],
  ) => {
    fixture.detectChanges();
    http.expectOne(`${API}${API_PATH}`).flush(items);
    await fixture.whenStable();
  };

  it('should create', async () => {
    await init();
    expect(component).toBeTruthy();
  });

  describe('loadItems', () => {
    it('should fire GET request and populate items on init', async () => {
      const items = [
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Beta' },
      ];
      await init(items);

      expect(component['items']()).toEqual(items);
    });

    it('should show danger toast when GET fails', async () => {
      fixture.detectChanges();
      http
        .expectOne(`${API}${API_PATH}`)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger', title: 'Fehler' }),
      );
      expect(component['items']()).toEqual([]);
    });
  });

  describe('startEdit / cancelEdit', () => {
    it('should set editingId and editingName', async () => {
      await init();

      component['startEdit']({ id: 1, name: 'Alpha' });

      expect(component['editingId']()).toBe(1);
      expect(component['editingName']()).toBe('Alpha');
    });

    it('should clear editingId on cancelEdit', async () => {
      await init();
      component['startEdit']({ id: 1, name: 'Alpha' });

      component['cancelEdit']();

      expect(component['editingId']()).toBeNull();
    });
  });

  describe('saveEdit', () => {
    it('should send PATCH and update item in list', async () => {
      await init([
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Beta' },
      ]);
      component['startEdit']({ id: 1, name: 'Alpha' });
      component['editingName'].set('Zeta');

      component['saveEdit']();

      const req = http.expectOne(`${API}${API_PATH}/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ name: 'Zeta' });

      req.flush({ id: 1, name: 'Zeta' });
      await fixture.whenStable();

      expect(component['items']().find((i) => i.id === 1)?.name).toBe('Zeta');
    });

    it('should sort items alphabetically after update', async () => {
      await init([
        { id: 1, name: 'Mango' },
        { id: 2, name: 'Apple' },
      ]);
      component['startEdit']({ id: 1, name: 'Mango' });
      component['editingName'].set('Zebra');

      component['saveEdit']();
      http.expectOne(`${API}${API_PATH}/1`).flush({ id: 1, name: 'Zebra' });
      await fixture.whenStable();

      const names = component['items']().map((i) => i.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it('should clear editingId and show success toast on save', async () => {
      await init();
      component['startEdit']({ id: 1, name: 'Alpha' });
      component['editingName'].set('Updated');

      component['saveEdit']();
      http.expectOne(`${API}${API_PATH}/1`).flush({ id: 1, name: 'Updated' });
      await fixture.whenStable();

      expect(component['editingId']()).toBeNull();
      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'success', title: 'Gespeichert' }),
      );
    });

    it('should show auth error toast on 401', async () => {
      await init();
      component['startEdit']({ id: 1, name: 'Alpha' });
      component['editingName'].set('New');

      component['saveEdit']();
      http
        .expectOne(`${API}${API_PATH}/1`)
        .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger', message: 'Keine Berechtigung.' }),
      );
    });

    it('should show generic error toast on 500', async () => {
      await init();
      component['startEdit']({ id: 1, name: 'Alpha' });
      component['editingName'].set('New');

      component['saveEdit']();
      http
        .expectOne(`${API}${API_PATH}/1`)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'danger',
          message: 'Speichern fehlgeschlagen. Bitte erneut versuchen.',
        }),
      );
    });

    it('should not send PATCH when trimmed name is empty', async () => {
      await init();
      component['startEdit']({ id: 1, name: 'Alpha' });
      component['editingName'].set('   ');

      component['saveEdit']();

      http.expectNone(`${API}${API_PATH}/1`);
    });

    it('should not send PATCH when editingId is null', async () => {
      await init();

      component['saveEdit']();

      http.expectNone(`${API}${API_PATH}/1`);
    });
  });

  describe('deleteItem', () => {
    it('should send DELETE and remove item when dialog confirms', async () => {
      await init([
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Beta' },
      ]);
      mockDialog.showActionDialog.mockReturnValue(of('delete'));

      component['deleteItem']({ id: 1, name: 'Alpha' });
      http.expectOne(`${API}${API_PATH}/1`).flush({ id: 1, name: 'Alpha' });
      await fixture.whenStable();

      expect(component['items']().find((i) => i.id === 1)).toBeUndefined();
      expect(component['items']().length).toBe(1);
    });

    it('should show success toast after deletion', async () => {
      await init([{ id: 1, name: 'Alpha' }]);
      mockDialog.showActionDialog.mockReturnValue(of('delete'));

      component['deleteItem']({ id: 1, name: 'Alpha' });
      http.expectOne(`${API}${API_PATH}/1`).flush({ id: 1, name: 'Alpha' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'success', title: 'Gelöscht' }),
      );
    });

    it('should not send DELETE when dialog is cancelled', async () => {
      await init([{ id: 1, name: 'Alpha' }]);
      mockDialog.showActionDialog.mockReturnValue(of('cancel'));

      component['deleteItem']({ id: 1, name: 'Alpha' });

      http.expectNone(`${API}${API_PATH}/1`);
    });

    it('should show auth error toast on 403', async () => {
      await init([{ id: 1, name: 'Alpha' }]);
      mockDialog.showActionDialog.mockReturnValue(of('delete'));

      component['deleteItem']({ id: 1, name: 'Alpha' });
      http
        .expectOne(`${API}${API_PATH}/1`)
        .flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger', message: 'Keine Berechtigung.' }),
      );
    });

    it('should show generic error toast on 500', async () => {
      await init([{ id: 1, name: 'Alpha' }]);
      mockDialog.showActionDialog.mockReturnValue(of('delete'));

      component['deleteItem']({ id: 1, name: 'Alpha' });
      http
        .expectOne(`${API}${API_PATH}/1`)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'danger',
          message: 'Löschen fehlgeschlagen. Bitte erneut versuchen.',
        }),
      );
    });
  });

  describe('addItem', () => {
    it('should send POST and add the new item', async () => {
      await init([{ id: 1, name: 'Alpha' }]);
      component['newName'].set('Gamma');

      component['addItem']();

      const req = http.expectOne(`${API}${API_PATH}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'Gamma' });

      req.flush({ id: 3, name: 'Gamma' });
      await fixture.whenStable();

      expect(component['items']().find((i) => i.id === 3)?.name).toBe('Gamma');
    });

    it('should sort items alphabetically after adding', async () => {
      await init([
        { id: 1, name: 'Mango' },
        { id: 2, name: 'Zebra' },
      ]);
      component['newName'].set('Apple');

      component['addItem']();
      http.expectOne(`${API}${API_PATH}`).flush({ id: 3, name: 'Apple' });
      await fixture.whenStable();

      const names = component['items']().map((i) => i.name);
      expect(names[0]).toBe('Apple');
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it('should clear newName and show success toast after adding', async () => {
      await init([]);
      component['newName'].set('Alpha');

      component['addItem']();
      http.expectOne(`${API}${API_PATH}`).flush({ id: 1, name: 'Alpha' });
      await fixture.whenStable();

      expect(component['newName']()).toBe('');
      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'success', title: 'Erstellt' }),
      );
    });

    it('should show auth error toast on 401', async () => {
      await init([]);
      component['newName'].set('Alpha');

      component['addItem']();
      http
        .expectOne(`${API}${API_PATH}`)
        .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'danger', message: 'Keine Berechtigung.' }),
      );
    });

    it('should show generic error toast on 500', async () => {
      await init([]);
      component['newName'].set('Alpha');

      component['addItem']();
      http
        .expectOne(`${API}${API_PATH}`)
        .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      await fixture.whenStable();

      expect(mockToast.showToastNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'danger',
          message: 'Erstellen fehlgeschlagen. Bitte erneut versuchen.',
        }),
      );
    });

    it('should not send POST when name is empty', async () => {
      await init([]);
      component['newName'].set('   ');

      component['addItem']();

      http.expectNone(`${API}${API_PATH}`);
    });
  });

  describe('itemActionMap', () => {
    it('should contain an entry for each loaded item', async () => {
      const items = [
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Beta' },
        { id: 3, name: 'Gamma' },
      ];
      await init(items);

      const map = component['itemActionMap']();
      expect(map.size).toBe(3);
      expect(map.has(1)).toBe(true);
      expect(map.has(2)).toBe(true);
      expect(map.has(3)).toBe(true);
    });

    it('should provide two actions per item (edit and delete)', async () => {
      await init([{ id: 1, name: 'Alpha' }]);

      const actions = component['itemActionMap']().get(1)!;
      expect(actions).toHaveLength(2);
      expect(actions[0].label).toBe('Bearbeiten');
      expect(actions[1].label).toBe('Löschen');
    });

    it('should return stable references between renders', async () => {
      await init([{ id: 1, name: 'Alpha' }]);

      const first = component['itemActionMap']().get(1);
      const second = component['itemActionMap']().get(1);
      expect(first).toBe(second);
    });
  });
});
