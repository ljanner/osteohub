import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview').then((m) => m.OverviewComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'disease-editor',
    loadComponent: () =>
      import('./pages/disease-editor/disease-editor').then((m) => m.DiseaseEditorComponent),
    canActivate: [authGuard],
  },
  {
    path: 'disease-editor/:id',
    loadComponent: () =>
      import('./pages/disease-editor/disease-editor').then((m) => m.DiseaseEditorComponent),
    canActivate: [authGuard],
  },
  {
    path: 'manage-categories',
    loadComponent: () =>
      import('./pages/manage-categories/manage-categories').then(
        (m) => m.ManageCategoriesComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
