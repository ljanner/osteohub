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
