import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseCardComponent } from './disease-card';

describe('DiseaseCardComponent', () => {
  let component: DiseaseCardComponent;
  let fixture: ComponentFixture<DiseaseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
