import { Routes } from '@angular/router';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { InvoiceManagementPermissions } from './models/invoice.consts';

export const invoiceManagementRoutes: Routes = [
  {
    path: '',
    component: InvoiceListComponent,
    data: {
      requiredPolicy: InvoiceManagementPermissions.Default
    }
  },
  {
    path: 'detail/:id',
    component: InvoiceDetailComponent,
    data: {
      requiredPolicy: InvoiceManagementPermissions.Default
    }
  }
];
