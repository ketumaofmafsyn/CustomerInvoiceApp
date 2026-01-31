import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService, CustomerDto } from '@proxy/customers';
import { PagedResultDto } from '@abp/ng.core';
import { ToasterService, ConfirmationService, Confirmation } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-customer-list',
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Customers</h1>
        <button 
          class="btn btn-primary d-flex align-items-center"
          [routerLink]="['/customer-management/create']"
          [disabled]="isLoading">
          <i class="fa fa-plus me-2"></i> New Customer
        </button>
      </div>

      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!isLoading && (!customers.items || customers.items.length === 0)" class="alert alert-info text-center py-5">
        <h4>No customers found. Create your first customer!</h4>
        <button 
          class="btn btn-primary mt-3"
          [routerLink]="['/customer-management/create']">
          <i class="fa fa-plus me-2"></i> Create First Customer
        </button>
      </div>

      <div *ngIf="!isLoading && customers.items?.length" class="table-responsive">
        <table class="table table-hover table-striped">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of customers.items" class="align-middle">
              <td>{{ c.name }}</td>
              <td>{{ c.email }}</td>
              <td>{{ c.phone || '—' }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-outline-info me-2"
                  [routerLink]="['/customer-management/detail', c.id]">
                  <i class="fa fa-eye"></i>
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  (click)="deleteCustomer(c.id, c.name)">
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CustomerListComponent implements OnInit {
  customers: PagedResultDto<CustomerDto> = new PagedResultDto<CustomerDto>();
  isLoading = false;

  constructor(
    private customerService: CustomerService,
    private toaster: ToasterService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getList({ maxResultCount: 10, skipCount: 0 }).subscribe({
      next: (res) => {
        this.customers = res;
        this.isLoading = false;
      },
      error: () => {
        this.toaster.error('Failed to load customers');
        this.isLoading = false;
      }
    });
  }

  deleteCustomer(id: string, name: string): void {
    this.confirmationService.warn(
      'Are you sure?',
      `Delete customer: ${name}?`,
      { messageLocalizationParams: [name] }
    ).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.customerService.delete(id).subscribe({
          next: () => {
            this.toaster.success('Customer deleted');
            this.loadCustomers();
          },
          error: () => this.toaster.error('Delete failed')
        });
      }
    });
  }
}