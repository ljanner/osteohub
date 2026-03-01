/* eslint-disable @typescript-eslint/dot-notation */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SiActionDialogService } from '@siemens/element-ng/action-modal';
import { SiToastNotificationService } from '@siemens/element-ng/toast-notification';
import { vi } from 'vitest';

import { environment } from '../../../environments/environment';
import { ManageCategoriesComponent } from './manage-categories';

const API = environment.apiBaseUrl;

const EXPECTED_LISTS: { label: string; apiPath: string }[] = [
  { label: 'Körperregionen', apiPath: '/body-region' },
  { label: 'Körpersysteme', apiPath: '/body-system' },
  { label: 'VINDICATE-Kategorien', apiPath: '/vindicate-category' },
  { label: 'Osteopathische Modelle', apiPath: '/osteopathic-model' },
  { label: 'Symptome', apiPath: '/symptom' },
];

describe('ManageCategoriesComponent', () => {
  let component: ManageCategoriesComponent;
  let fixture: ComponentFixture<ManageCategoriesComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCategoriesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SiToastNotificationService, useValue: { showToastNotification: vi.fn() } },
        { provide: SiActionDialogService, useValue: { showActionDialog: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCategoriesComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    for (const { apiPath } of EXPECTED_LISTS) {
      http.expectOne(`${API}${apiPath}`).flush([]);
    }
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a heading', () => {
    const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(h1).toBeTruthy();
    expect(h1.textContent).toContain('Kategorien verwalten');
  });

  it('should render 5 app-category-list elements', () => {
    const lists = fixture.debugElement.queryAll(By.css('app-category-list'));
    expect(lists).toHaveLength(5);
  });

  it.each(EXPECTED_LISTS)(
    'should render app-category-list with label "$label" and apiPath "$apiPath"',
    ({ label, apiPath }) => {
      const lists = fixture.debugElement.queryAll(By.css('app-category-list'));
      const match = lists.find(
        (el) =>
          el.componentInstance['label']() === label &&
          el.componentInstance['apiPath']() === apiPath,
      );
      expect(match).toBeTruthy();
    },
  );
});
