import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Disease } from '../../models/types';
import { DiseaseCardComponent } from './disease-card';

describe('DiseaseCardComponent', () => {
  let component: DiseaseCardComponent;
  let fixture: ComponentFixture<DiseaseCardComponent>;

  const mockDisease: Disease = {
    id: 1,
    name: 'Arthrose',
    description: 'Degenerative Gelenkerkrankung',
    bodyRegions: [{ id: 1, name: 'Mehrere Gelenke' }],
    bodySystems: [{ id: 1, name: 'Muskuloskelettal' }],
    vindicateCategories: [{ id: 1, name: 'Degenerativ' }],
    osteopathicModels: [{ id: 1, name: 'Biomechanisch' }],
    symptoms: [{ id: 1, name: 'Belastungsschmerz' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('disease', mockDisease);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
