import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { FilterSelectionComponent } from './components/filter-selection/filter-selection';
import { OverviewComponent } from './overview';

@Component({
  selector: 'app-filter-selection',
  template: '',
})
class FilterSelectionStubComponent {
  readonly filtersChanged = output<void>();
}

describe('Overview', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(OverviewComponent, {
        remove: { imports: [FilterSelectionComponent] },
        add: { imports: [FilterSelectionStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', async () => {
    fixture.detectChanges();

    const request = httpTestingController.expectOne(`${environment.apiBaseUrl}/disease`);
    request.flush([]);

    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
