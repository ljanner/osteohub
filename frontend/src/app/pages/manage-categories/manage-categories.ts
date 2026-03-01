import { Component } from '@angular/core';

import { CategoryListComponent } from './category-list/category-list';

@Component({
  selector: 'app-manage-categories',
  imports: [CategoryListComponent],
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.scss',
})
export class ManageCategoriesComponent {}
