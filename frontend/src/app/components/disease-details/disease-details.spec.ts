import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { DiseaseExtended } from '../../models/types';
import { DiseaseDetailsComponent } from './disease-details';

const createDisease = (overrides: Partial<DiseaseExtended> = {}): DiseaseExtended => ({
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
  ...overrides,
});

describe('DiseaseDetailsComponent', () => {
  let component: DiseaseDetailsComponent;
  let fixture: ComponentFixture<DiseaseDetailsComponent>;

  const query = (selector: string): HTMLElement | null =>
    fixture.nativeElement.querySelector(selector);

  const queryAll = (selector: string): HTMLElement[] => [
    ...fixture.nativeElement.querySelectorAll(selector),
  ];

  const textOf = (selector: string): string => query(selector)?.textContent?.trim() ?? '';

  const allTextOf = (selector: string): string[] =>
    queryAll(selector).map((el) => el.textContent?.trim() ?? '');

  const setDisease = (disease: DiseaseExtended): void => {
    fixture.componentRef.setInput('disease', disease);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseDetailsComponent);
    component = fixture.componentInstance;
  });

  describe('header section', () => {
    beforeEach(() => setDisease(createDisease()));

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display the disease name as heading', () => {
      expect(textOf('h2')).toBe('Arthrose');
    });

    it('should display the ICD code', () => {
      const icdText = queryAll('.text-secondary')[0]?.textContent?.trim();
      expect(icdText).toContain('ICD:');
      expect(icdText).toContain('M15-M19');
    });

    it('should display the description', () => {
      expect(fixture.nativeElement.textContent).toContain('Degenerative Gelenkerkrankung');
    });
  });

  describe('body regions and systems subtitle', () => {
    it('should display a single body region without trailing comma', () => {
      setDisease(createDisease({ bodyRegions: [{ id: 1, name: 'Knie' }] }));
      const subtitle = queryAll('.text-secondary')[1]?.textContent?.trim() ?? '';
      expect(subtitle).toContain('Knie');
      expect(subtitle).not.toMatch(/Knie\s*,/);
    });

    it('should separate multiple body regions with commas', () => {
      setDisease(
        createDisease({
          bodyRegions: [
            { id: 1, name: 'Knie' },
            { id: 2, name: 'Hüfte' },
          ],
        }),
      );
      const subtitle = queryAll('.text-secondary')[1]?.textContent?.trim() ?? '';
      expect(subtitle).toContain('Knie,');
      expect(subtitle).toContain('Hüfte');
      expect(subtitle).not.toMatch(/Hüfte\s*,/);
    });

    it('should display a single body system without trailing comma', () => {
      setDisease(createDisease({ bodySystems: [{ id: 1, name: 'Nervensystem' }] }));
      const subtitle = queryAll('.text-secondary')[1]?.textContent?.trim() ?? '';
      expect(subtitle).toContain('Nervensystem');
      expect(subtitle).not.toMatch(/Nervensystem\s*,/);
    });

    it('should separate multiple body systems with commas', () => {
      setDisease(
        createDisease({
          bodySystems: [
            { id: 1, name: 'Nervensystem' },
            { id: 2, name: 'Kreislauf' },
          ],
        }),
      );
      const subtitle = queryAll('.text-secondary')[1]?.textContent?.trim() ?? '';
      expect(subtitle).toContain('Nervensystem,');
      expect(subtitle).toContain('Kreislauf');
      expect(subtitle).not.toMatch(/Kreislauf\s*,/);
    });

    it('should place a bullet separator between regions and systems', () => {
      setDisease(createDisease());
      const subtitle = queryAll('.text-secondary')[1]?.textContent?.trim() ?? '';
      expect(subtitle).toContain('•');
    });
  });

  describe('badges', () => {
    it('should render osteopathic model badges with success-emphasis style', () => {
      setDisease(
        createDisease({
          osteopathicModels: [{ id: 1, name: 'Biomechanisch' }],
          vindicateCategories: [],
          symptoms: [],
        }),
      );
      const badges = queryAll('.badge');
      expect(badges.length).toBe(1);
      expect(badges[0].textContent?.trim()).toBe('Biomechanisch');
      expect(badges[0].classList.contains('bg-success-emphasis')).toBe(true);
    });

    it('should render vindicate category badges with info-emphasis style', () => {
      setDisease(
        createDisease({
          osteopathicModels: [],
          vindicateCategories: [{ id: 1, name: 'Degenerativ' }],
        }),
      );
      const badges = queryAll('.badge:not(.bg-secondary)');
      expect(badges.length).toBe(1);
      expect(badges[0].textContent?.trim()).toBe('Degenerativ');
      expect(badges[0].classList.contains('bg-info-emphasis')).toBe(true);
    });

    it('should render symptom badges with secondary style', () => {
      setDisease(
        createDisease({
          symptoms: [{ id: 1, name: 'Belastungsschmerz' }],
        }),
      );
      const symptomBadges = queryAll('.badge.bg-secondary');
      expect(symptomBadges.length).toBe(1);
      expect(symptomBadges[0].textContent?.trim()).toBe('Belastungsschmerz');
    });

    it('should order badges: models before categories', () => {
      setDisease(
        createDisease({
          osteopathicModels: [{ id: 1, name: 'Model-A' }],
          vindicateCategories: [{ id: 1, name: 'Category-B' }],
        }),
      );
      const topBadges = queryAll('.badge:not(.bg-secondary)');
      expect(topBadges.map((b) => b.textContent?.trim())).toEqual(['Model-A', 'Category-B']);
    });

    it('should render no top badges when models and categories are empty', () => {
      setDisease(
        createDisease({
          osteopathicModels: [],
          vindicateCategories: [],
        }),
      );
      const topBadges = queryAll('.badge:not(.bg-secondary)');
      expect(topBadges.length).toBe(0);
    });

    it('should render no symptom badges when symptoms are empty', () => {
      setDisease(createDisease({ symptoms: [] }));
      const symptomBadges = queryAll('.badge.bg-secondary');
      expect(symptomBadges.length).toBe(0);
    });

    it('should render multiple symptoms as individual badges', () => {
      setDisease(
        createDisease({
          symptoms: [
            { id: 1, name: 'Belastungsschmerz' },
            { id: 2, name: 'Schwellung' },
            { id: 3, name: 'Krepitation' },
          ],
        }),
      );
      const symptomBadges = queryAll('.badge.bg-secondary');
      expect(symptomBadges.length).toBe(3);
      expect(symptomBadges.map((b) => b.textContent?.trim())).toEqual([
        'Belastungsschmerz',
        'Schwellung',
        'Krepitation',
      ]);
    });
  });

  describe('detail sections', () => {
    beforeEach(() => setDisease(createDisease()));

    it('should display all detail section headings', () => {
      const headings = allTextOf('.detail-heading');
      expect(headings).toEqual([
        'Ätiologie',
        'Pathogenese',
        'Häufigkeit',
        'Symptome',
        'Red Flags',
        'Diagnostik',
        'Prognose',
        'Therapie',
        'Osteopathische Behandlung',
      ]);
    });

    it('should display etiology content', () => {
      expect(fixture.nativeElement.textContent).toContain('Multifaktoriell');
    });

    it('should display pathogenesis content', () => {
      expect(fixture.nativeElement.textContent).toContain('Knorpeldegeneration');
    });

    it('should display frequency content', () => {
      expect(fixture.nativeElement.textContent).toContain('Häufig');
    });

    it('should display red flags content', () => {
      expect(fixture.nativeElement.textContent).toContain('Atypische Verläufe');
    });

    it('should display diagnostics content', () => {
      expect(fixture.nativeElement.textContent).toContain('Klinik und Bildgebung');
    });

    it('should display prognosis content', () => {
      expect(fixture.nativeElement.textContent).toContain('Nicht heilbar');
    });

    it('should display therapy content', () => {
      expect(fixture.nativeElement.textContent).toContain('Konservativ und operativ');
    });

    it('should display osteopathic treatment content', () => {
      expect(fixture.nativeElement.textContent).toContain('Dysbalancen ausgleichen');
    });

    it('should render horizontal rule separators', () => {
      const separators = queryAll('hr');
      expect(separators.length).toBe(4);
    });
  });

  describe('detail sections with different data', () => {
    it('should update all fields when disease changes', () => {
      setDisease(
        createDisease({
          name: 'Skoliose',
          icd: 'M41',
          etiology: 'Idiopathisch',
          pathogenesis: 'Wirbelkörperrotation',
          frequency: 'Selten',
          redFlags: 'Neurologische Ausfälle',
          diagnostics: 'Röntgen',
          prognosis: 'Variabel',
          therapy: 'Physiotherapie',
          osteopathicTreatment: 'Mobilisation',
        }),
      );
      const content = fixture.nativeElement.textContent;
      expect(textOf('h2')).toBe('Skoliose');
      expect(content).toContain('M41');
      expect(content).toContain('Idiopathisch');
      expect(content).toContain('Wirbelkörperrotation');
      expect(content).toContain('Selten');
      expect(content).toContain('Neurologische Ausfälle');
      expect(content).toContain('Röntgen');
      expect(content).toContain('Variabel');
      expect(content).toContain('Physiotherapie');
      expect(content).toContain('Mobilisation');
    });

    it('should handle empty string fields gracefully', () => {
      setDisease(
        createDisease({
          etiology: '',
          pathogenesis: '',
          redFlags: '',
          diagnostics: '',
          therapy: '',
          prognosis: '',
          osteopathicTreatment: '',
        }),
      );
      expect(component).toBeTruthy();
      const headings = allTextOf('.detail-heading');
      expect(headings.length).toBe(9);
    });
  });

  describe('empty state', () => {
    it('should show fallback message when disease input is not set', () => {
      fixture.componentRef.setInput('disease', undefined);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Keine Krankheit ausgewählt.');
    });

    it('should not render heading when disease is not set', () => {
      fixture.componentRef.setInput('disease', undefined);
      fixture.detectChanges();
      expect(query('h2')).toBeNull();
    });

    it('should not render detail sections when disease is not set', () => {
      fixture.componentRef.setInput('disease', undefined);
      fixture.detectChanges();
      expect(queryAll('.detail-heading').length).toBe(0);
    });
  });
});
