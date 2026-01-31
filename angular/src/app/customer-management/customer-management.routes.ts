import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerModalComponent } from './components/customer-modal/customer-modal.component';

export const customerManagementRoutes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    data: { // ✅ MUST HAVE THIS
      requiredPolicy: 'CustomerInvoiceApp.CustomerManagement.Default'
    }
  },
  {
    path: 'create',
    component: CustomerModalComponent,
    data: {
      requiredPolicy: 'CustomerInvoiceApp.CustomerManagement.Create'
    }
  }
];