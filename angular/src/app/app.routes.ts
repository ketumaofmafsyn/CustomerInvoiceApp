import { Routes } from '@angular/router';
import { APP_ROUTE_PROVIDER } from './route.provider';
// ✅ ADD THIS

export const appRoutes: Routes = [
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule)
  },
  {
    path: 'customer-management',
    loadChildren: () => import('./customer-management/customer-management.routes')
      .then(m => m.customerManagementRoutes)
  },
  {
    path: 'invoice-management',
    loadChildren: () => import('./invoice-management/invoice-management.routes')
      .then(m => m.invoiceManagementRoutes)
  },
  {
    path: '',
    redirectTo: 'customer-management',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'customer-management'
  }
];

// ✅ ADD THIS AT THE END - Enforces authentication on all routes
export const appProviders = [
  APP_ROUTE_PROVIDER // This provider adds auth guards to routes with data
];