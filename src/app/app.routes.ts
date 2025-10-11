import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then(c => c.Auth)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(c => c.Dashboard)
  },
  {
    path: 'reports',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard').then(c => c.Dashboard)
      },
      {
        path: 'builder',
        loadComponent: () => import('./features/report-builder/report-builder').then(c => c.ReportBuilder)
      },
      {
        path: 'builder/:id',
        loadComponent: () => import('./features/report-builder/report-builder').then(c => c.ReportBuilder)
      }
    ]
  },
  {
    path: 'report-builder',
    loadComponent: () => import('./features/report-builder/report-builder').then(c => c.ReportBuilder)
  },
  {
    path: 'data-sources',
    loadComponent: () => import('./features/data-sources/data-sources').then(c => c.DataSources)
  },
  {
    path: 'grid-dashboard-2',
    loadComponent: () => import('./components/grid-dashboard-2/grid-dashboard-2.component').then(c => c.GridDashboard2Component)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
