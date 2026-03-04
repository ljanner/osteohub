import { Component, input } from '@angular/core';

import type { DiseaseExtended } from '../../../../models/types';

@Component({
  selector: 'app-disease-details',
  imports: [],
  templateUrl: './disease-details.html',
  styleUrl: './disease-details.scss',
})
export class DiseaseDetailsComponent {
  readonly disease = input.required<DiseaseExtended>();
}
