import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { DiseaseExtended } from '../../models/types';
import { DiseaseDetailsComponent } from './disease-details';

describe('DiseaseDetailsComponent', () => {
  let component: DiseaseDetailsComponent;
  let fixture: ComponentFixture<DiseaseDetailsComponent>;

  const mockDisease: DiseaseExtended = {
    id: 1,
    name: 'Arthrose',
    description: 'Degenerative Gelenkerkrankung',
    bodyRegions: [{ id: 1, name: 'Mehrere Gelenke' }],
    bodySystems: [{ id: 1, name: 'Muskuloskelettal' }],
    vindicateCategories: [{ id: 1, name: 'Degenerativ' }],
    osteopathicModels: [{ id: 1, name: 'Biomechanisch' }],
    symptoms: [{ id: 1, name: 'Belastungsschmerz' }],
    icd: 'M15-M19',
    frequency: 'Häufig',
    etiology: 'Multifaktoriell',
    pathogenesis: 'Knorpeldegeneration',
    redFlags: 'Atypische Verläufe',
    diagnostics: 'Klinik und Bildgebung',
    therapy: 'Konservativ und operativ',
    prognosis: 'Nicht heilbar',
    osteopathicTreatment: 'Dysbalancen ausgleichen',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('disease', mockDisease);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
