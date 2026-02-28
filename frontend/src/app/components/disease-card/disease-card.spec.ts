import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Disease } from '../../models/types';
import { DiseaseCardComponent } from './disease-card';

const createDisease = (overrides: Partial<Disease> = {}): Disease => ({
  id: 1,
  name: 'Arthrose',
  description: 'Degenerative Gelenkerkrankung',
  bodyRegions: [{ id: 1, name: 'Mehrere Gelenke' }],
  bodySystems: [{ id: 1, name: 'Muskuloskelettal' }],
  vindicateCategories: [{ id: 1, name: 'Degenerativ' }],
  osteopathicModels: [{ id: 1, name: 'Biomechanisch' }],
  symptoms: [{ id: 1, name: 'Belastungsschmerz' }],
  ...overrides,
});

describe('DiseaseCardComponent', () => {
  let component: DiseaseCardComponent;
  let fixture: ComponentFixture<DiseaseCardComponent>;

  const query = (selector: string): HTMLElement | null =>
    fixture.nativeElement.querySelector(selector);

  const queryAll = (selector: string): HTMLElement[] => [
    ...fixture.nativeElement.querySelectorAll(selector),
  ];

  const textOf = (selector: string): string => query(selector)?.textContent?.trim() ?? '';

  const setDisease = (disease: Disease | null): void => {
    fixture.componentRef.setInput('disease', disease);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseCardComponent);
    component = fixture.componentInstance;
  });

  describe('loading state (disease = null)', () => {
    beforeEach(() => {
      setDisease(null);
    });

    it('should add "loading" class to host element', () => {
      expect(fixture.nativeElement.classList.contains('loading')).toBe(true);
    });

    it('should render skeleton placeholders', () => {
      expect(query('.skeleton-heading')).toBeTruthy();
      expect(query('.skeleton-subheading')).toBeTruthy();
      expect(query('.skeleton-description')).toBeTruthy();
      expect(queryAll('.skeleton-badge').length).toBe(5);
    });

    it('should hide skeletons from assistive technologies', () => {
      const skeletonContainer = query('[aria-hidden="true"]');
      expect(skeletonContainer).toBeTruthy();
    });

    it('should NOT render disease name or description', () => {
      expect(query('.si-h4')).toBeNull();
    });
  });

  describe('disease rendering', () => {
    beforeEach(() => {
      setDisease(createDisease());
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should remove "loading" class from host element', () => {
      expect(fixture.nativeElement.classList.contains('loading')).toBe(false);
    });

    it('should NOT render skeleton placeholders', () => {
      expect(query('.skeleton-heading')).toBeNull();
    });

    it('should display the disease name', () => {
      expect(textOf('.si-h4')).toBe('Arthrose');
    });

    it('should display the description', () => {
      const description = queryAll('.text-truncate').find(
        (el) => !el.classList.contains('text-secondary'),
      );
      expect(description?.textContent).toContain('Degenerative Gelenkerkrankung');
    });
  });

  describe('body regions and systems subtitle', () => {
    it('should display a single body region without trailing comma', () => {
      setDisease(createDisease({ bodyRegions: [{ id: 1, name: 'Knie' }] }));
      const subtitle = textOf('.text-secondary');
      expect(subtitle).toContain('Knie');
      expect(subtitle).not.toMatch(/Knie\s*,/);
    });

    it('should separate multiple body regions with commas', () => {
      setDisease(
        createDisease({
          bodyRegions: [
            { id: 1, name: 'Knie' },
            { id: 2, name: 'Hüfte' },
            { id: 3, name: 'Schulter' },
          ],
        }),
      );
      const subtitle = textOf('.text-secondary');
      expect(subtitle).toContain('Knie,');
      expect(subtitle).toContain('Hüfte,');
      expect(subtitle).toContain('Schulter');
      expect(subtitle).not.toMatch(/Schulter\s*,/);
    });

    it('should display a single body system without trailing comma', () => {
      setDisease(createDisease({ bodySystems: [{ id: 1, name: 'Nervensystem' }] }));
      const subtitle = textOf('.text-secondary');
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
      const subtitle = textOf('.text-secondary');
      expect(subtitle).toContain('Nervensystem,');
      expect(subtitle).toContain('Kreislauf');
      expect(subtitle).not.toMatch(/Kreislauf\s*,/);
    });

    it('should place a bullet separator between regions and systems', () => {
      setDisease(createDisease());
      const subtitle = textOf('.text-secondary');
      expect(subtitle).toContain('•');
    });
  });

  describe('badges', () => {
    describe('badge types and styling', () => {
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
            symptoms: [],
          }),
        );
        const badges = queryAll('.badge');
        expect(badges.length).toBe(1);
        expect(badges[0].textContent?.trim()).toBe('Degenerativ');
        expect(badges[0].classList.contains('bg-info-emphasis')).toBe(true);
      });

      it('should render symptom badges with secondary style', () => {
        setDisease(
          createDisease({
            osteopathicModels: [],
            vindicateCategories: [],
            symptoms: [{ id: 1, name: 'Belastungsschmerz' }],
          }),
        );
        const badges = queryAll('.badge');
        expect(badges.length).toBe(1);
        expect(badges[0].textContent?.trim()).toBe('Belastungsschmerz');
        expect(badges[0].classList.contains('bg-secondary')).toBe(true);
      });
    });

    describe('badge ordering', () => {
      it('should order badges: models → categories → symptoms', () => {
        setDisease(
          createDisease({
            osteopathicModels: [{ id: 1, name: 'Model-A' }],
            vindicateCategories: [{ id: 1, name: 'Category-B' }],
            symptoms: [{ id: 1, name: 'Symptom-C' }],
          }),
        );
        const names = queryAll('.badge').map((el) => el.textContent?.trim());
        expect(names).toEqual(['Model-A', 'Category-B', 'Symptom-C']);
      });
    });

    describe('zero badges', () => {
      it('should render no badges when all arrays are empty', () => {
        setDisease(
          createDisease({
            osteopathicModels: [],
            vindicateCategories: [],
            symptoms: [],
          }),
        );
        expect(queryAll('.badge').length).toBe(0);
      });
    });
  });

  describe('badge truncation', () => {
    it('should show all badges when total equals maxBadgeCount (5)', () => {
      setDisease(
        createDisease({
          osteopathicModels: [
            { id: 1, name: 'M1' },
            { id: 2, name: 'M2' },
          ],
          vindicateCategories: [
            { id: 1, name: 'C1' },
            { id: 2, name: 'C2' },
          ],
          symptoms: [{ id: 1, name: 'S1' }],
        }),
      );
      const badges = queryAll('.badge');
      expect(badges.length).toBe(5);
      expect(badges.map((b) => b.textContent?.trim())).toEqual(['M1', 'M2', 'C1', 'C2', 'S1']);
    });

    it('should NOT show a "+N" counter when total equals maxBadgeCount', () => {
      setDisease(
        createDisease({
          osteopathicModels: [
            { id: 1, name: 'M1' },
            { id: 2, name: 'M2' },
          ],
          vindicateCategories: [
            { id: 1, name: 'C1' },
            { id: 2, name: 'C2' },
          ],
          symptoms: [{ id: 1, name: 'S1' }],
        }),
      );
      const allBadgeTexts = queryAll('.badge').map((b) => b.textContent?.trim());
      expect(allBadgeTexts.some((t) => t?.startsWith('+'))).toBe(false);
    });

    it('should truncate badges and show "+1" when total is 6', () => {
      setDisease(
        createDisease({
          osteopathicModels: [
            { id: 1, name: 'M1' },
            { id: 2, name: 'M2' },
          ],
          vindicateCategories: [
            { id: 1, name: 'C1' },
            { id: 2, name: 'C2' },
          ],
          symptoms: [
            { id: 1, name: 'S1' },
            { id: 2, name: 'S2' },
          ],
        }),
      );
      const badges = queryAll('.badge');
      expect(badges.length).toBe(6);
      expect(badges[5].textContent?.trim()).toBe('+1');
    });

    it('should truncate badges and show "+3" when total is 8', () => {
      setDisease(
        createDisease({
          osteopathicModels: [
            { id: 1, name: 'M1' },
            { id: 2, name: 'M2' },
            { id: 3, name: 'M3' },
          ],
          vindicateCategories: [
            { id: 1, name: 'C1' },
            { id: 2, name: 'C2' },
            { id: 3, name: 'C3' },
          ],
          symptoms: [
            { id: 1, name: 'S1' },
            { id: 2, name: 'S2' },
          ],
        }),
      );
      const badges = queryAll('.badge');
      expect(badges.length).toBe(6);
      expect(badges[5].textContent?.trim()).toBe('+3');
    });

    it('should respect badge order even when truncated', () => {
      setDisease(
        createDisease({
          osteopathicModels: [
            { id: 1, name: 'M1' },
            { id: 2, name: 'M2' },
            { id: 3, name: 'M3' },
          ],
          vindicateCategories: [
            { id: 1, name: 'C1' },
            { id: 2, name: 'C2' },
          ],
          symptoms: [
            { id: 1, name: 'S1' },
            { id: 2, name: 'S2' },
          ],
        }),
      );
      const visibleNames = queryAll('.badge')
        .slice(0, 5)
        .map((b) => b.textContent?.trim());
      expect(visibleNames).toEqual(['M1', 'M2', 'M3', 'C1', 'C2']);
    });

    it('should show "+N" counter with secondary badge style', () => {
      setDisease(
        createDisease({
          osteopathicModels: [
            { id: 1, name: 'M1' },
            { id: 2, name: 'M2' },
            { id: 3, name: 'M3' },
          ],
          vindicateCategories: [
            { id: 1, name: 'C1' },
            { id: 2, name: 'C2' },
            { id: 3, name: 'C3' },
          ],
          symptoms: [],
        }),
      );
      const counterBadge = queryAll('.badge').at(-1)!;
      expect(counterBadge.classList.contains('bg-secondary')).toBe(true);
    });
  });

  describe('fewer badges than maxBadgeCount', () => {
    it('should show all badges when total is below maxBadgeCount', () => {
      setDisease(
        createDisease({
          osteopathicModels: [{ id: 1, name: 'M1' }],
          vindicateCategories: [{ id: 1, name: 'C1' }],
          symptoms: [],
        }),
      );
      const badges = queryAll('.badge');
      expect(badges.length).toBe(2);
      expect(badges.map((b) => b.textContent?.trim())).toEqual(['M1', 'C1']);
    });

    it('should NOT show a "+N" counter when total is 1', () => {
      setDisease(
        createDisease({
          osteopathicModels: [{ id: 1, name: 'M1' }],
          vindicateCategories: [],
          symptoms: [],
        }),
      );
      const allBadgeTexts = queryAll('.badge').map((b) => b.textContent?.trim());
      expect(allBadgeTexts.length).toBe(1);
      expect(allBadgeTexts[0]).toBe('M1');
    });
  });

  describe('state transitions', () => {
    it('should switch from skeleton to disease content when input changes from null to disease', () => {
      setDisease(null);
      expect(query('.skeleton-heading')).toBeTruthy();
      expect(query('.si-h4')).toBeNull();

      setDisease(createDisease());
      expect(query('.skeleton-heading')).toBeNull();
      expect(query('.si-h4')).toBeTruthy();
      expect(textOf('.si-h4')).toBe('Arthrose');
    });

    it('should switch back to skeleton when input changes from disease to null', () => {
      setDisease(createDisease());
      expect(query('.si-h4')).toBeTruthy();

      setDisease(null);
      expect(query('.si-h4')).toBeNull();
      expect(query('.skeleton-heading')).toBeTruthy();
      expect(fixture.nativeElement.classList.contains('loading')).toBe(true);
    });

    it('should update displayed content when disease input changes', () => {
      setDisease(createDisease({ name: 'Arthrose' }));
      expect(textOf('.si-h4')).toBe('Arthrose');

      setDisease(createDisease({ name: 'Skoliose', description: 'Seitliche Verkrümmung' }));
      expect(textOf('.si-h4')).toBe('Skoliose');
      const description = queryAll('.text-truncate').find(
        (el) => !el.classList.contains('text-secondary'),
      );
      expect(description?.textContent).toContain('Seitliche Verkrümmung');
    });
  });
});
