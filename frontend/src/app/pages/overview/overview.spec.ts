import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { OverviewComponent } from './overview';

describe('Overview', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', async () => {
    const request = httpTestingController.expectOne(`${environment.apiBaseUrl}/symptoms`);
    request.flush([]);

    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
