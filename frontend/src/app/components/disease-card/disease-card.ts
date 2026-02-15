import { Component, input } from '@angular/core';
import { SiCardComponent } from '@siemens/element-ng/card';

import type { Disease } from '../../models/types';

@Component({
  selector: 'app-disease-card',
  imports: [SiCardComponent],
  templateUrl: './disease-card.html',
  styleUrl: './disease-card.scss',
})
export class DiseaseCardComponent {
  readonly disease = input.required<Disease>();

  protected readonly maxBadgeCount = 5;

  protected getVisibleBadges(): { key: string; name: string; className: string }[] {
    const disease = this.disease();

    const allBadges = [
      ...disease.osteopathicModels.map((model) => ({
        key: `model-${model.id}`,
        name: model.name,
        className: 'bg-success-emphasis',
      })),
      ...disease.vindicateCategories.map((category) => ({
        key: `category-${category.id}`,
        name: category.name,
        className: 'bg-info-emphasis',
      })),
      ...disease.symptoms.map((symptom) => ({
        key: `symptom-${symptom.id}`,
        name: symptom.name,
        className: 'bg-secondary',
      })),
    ];

    return allBadges.slice(0, this.maxBadgeCount);
  }

  protected getHiddenBadgeCount(): number {
    const disease = this.disease();
    const totalBadgeCount =
      disease.osteopathicModels.length +
      disease.vindicateCategories.length +
      disease.symptoms.length;

    return Math.max(0, totalBadgeCount - this.maxBadgeCount);
  }
}
