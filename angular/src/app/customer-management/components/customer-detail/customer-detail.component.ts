import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService, CustomerDto } from '@proxy/customers';
import { InvoiceService, InvoiceDto } from '@proxy/invoices';
import { CustomerPermissionsService } from '../../services/customer-permissions.service';
import { CardComponent, Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared'; // ✅ FIXED IMPORT
import { PagedResultDto, PermissionDirective } from '@abp/ng.core';
import { CommonModule } from '@angular/common';

// Local interface for invoice filtering (matches backend implementation)
interface GetInvoicesByCustomerDto {
  customerId?: string;
  maxResultCount?: number;
  skipCount?: number;
}

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
   standalone: true, 
  imports: [
  CommonModule,
    RouterModule,
      

]
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  customer: CustomerDto | null = null;
  invoices: PagedResultDto<InvoiceDto> = new PagedResultDto<InvoiceDto>();
  isLoading = true;
  isDeleting = false;
  
  // Status badge mapping (matches backend enum values)
  readonly statusBadges: Record<number, string> = {
    0: 'secondary', // Draft
    1: 'warning',   // Sent
    2: 'success',   // Paid
    3: 'danger'     // Overdue
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    public permissions: CustomerPermissionsService,
    private confirmationService: ConfirmationService,
    private toaster: ToasterService // ✅ FIXED VARIABLE NAME
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadCustomer(id);
          this.loadInvoices(id);
        } else {
          this.toaster.error('::CustomerNotFound'); // ✅ FIXED METHOD CALL
          this.router.navigate(['/customer-management']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCustomer(id: string): void {
    this.isLoading = true;
    this.customerService.get(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customer) => {
          this.customer = customer;
          this.isLoading = false;
        },
        error: () => {
          this.toaster.error('::FailedToLoadCustomer'); // ✅ FIXED
          this.isLoading = false;
          this.router.navigate(['/customer-management']);
        }
      });
  }

  private loadInvoices(customerId: string): void {
    const params: GetInvoicesByCustomerDto = {
      customerId,
      maxResultCount: 20,
      skipCount: 0
    };

    // Cast to any ONLY for parameter shape (safe with backend contract)
    this.invoiceService.getList(params as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => this.invoices = result,
        error: () => this.toaster.error('::FailedToLoadInvoices') // ✅ FIXED
      });
  }

  getStatusBadgeClass(status: number): string {
    return `badge bg-${this.statusBadges[status] || 'secondary'}`;
  }

  getStatusText(status: number): string {
    return `::InvoiceStatus.${status}`; // Matches i18n keys
  }

  editCustomer(): void {
    this.router.navigate([`/customer-management/edit`, this.customer.id]);
  }

  deleteCustomer(): void {
    if (!this.customer) return;
    
    this.confirmationService.warn(
      '::AreYouSureToDelete',
      '::DeleteConfirmationMessage',
      { messageLocalizationParams: [this.customer.name] }
    ).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.isDeleting = true;
        this.customerService.delete(this.customer.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.toaster.success('::CustomerDeletedSuccessfully'); // ✅ FIXED
              this.router.navigate(['/customer-management']);
            },
            error: () => {
              this.toaster.error('::DeleteFailed'); // ✅ FIXED
              this.isDeleting = false;
            }
          });
      }
    });
  }

  navigateToInvoice(id: string): void {
    this.router.navigate([`/invoice-management/detail`, id]);
  }

  goBack(): void {
    this.router.navigate(['/customer-management']);
  }
}