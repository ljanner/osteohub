import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseDetailsComponent } from './disease-details';

describe('DiseaseDetailsComponent', () => {
  let component: DiseaseDetailsComponent;
  let fixture: ComponentFixture<DiseaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
