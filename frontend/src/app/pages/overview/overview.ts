import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewComponent {
  private http = inject(HttpClient);

  getSymptoms() {
    this.http.get(environment.apiBaseUrl + '/symptoms').subscribe(console.log);
  }

  constructor() {
    this.getSymptoms();
  }
}
