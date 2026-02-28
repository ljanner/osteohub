import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../../../environments/environment';
import { FilterSelectionComponent } from './filter-selection';

describe('FilterSelectionComponent', () => {
  let component: FilterSelectionComponent;
  let fixture: ComponentFixture<FilterSelectionComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSelectionComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSelectionComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', async () => {
    fixture.detectChanges();

    httpTestingController.expectOne(`${environment.apiBaseUrl}/body-region`).flush([]);
    httpTestingController.expectOne(`${environment.apiBaseUrl}/body-system`).flush([]);
    httpTestingController.expectOne(`${environment.apiBaseUrl}/vindicate-category`).flush([]);
    httpTestingController.expectOne(`${environment.apiBaseUrl}/osteopathic-model`).flush([]);
    httpTestingController.expectOne(`${environment.apiBaseUrl}/symptom`).flush([]);

    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
