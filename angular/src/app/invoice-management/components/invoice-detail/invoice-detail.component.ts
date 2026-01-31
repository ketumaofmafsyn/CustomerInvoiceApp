import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { InvoiceService, InvoiceDto } from '@proxy/invoices';
import { CustomerService, CustomerDto } from '@proxy/customers';
import { InvoicePermissionsService } from '../../services/invoice-permissions.service';
import { CardComponent, Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { InvoiceStatus } from '../../models/invoice.consts';
import { CommonModule } from '@angular/common';
import { PermissionDirective } from '@abp/ng.core';


@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
   standalone: true, 
  imports: [
  CommonModule,
    RouterModule,
     
]
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  invoice: InvoiceDto | null = null;
  customer: CustomerDto | null = null;
  isLoading = true;
  isProcessing = false;
  readonly InvoiceStatus = InvoiceStatus;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    public permissions: InvoicePermissionsService,
    private confirmationService: ConfirmationService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadInvoice(id);
        } else {
          this.toaster.error('Invoice not found');
          this.router.navigate(['/invoice-management']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInvoice(id: string): void {
    this.isLoading = true;
    this.invoiceService.get(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoice) => {
          this.invoice = invoice;
          if (invoice.customerId) {
            this.loadCustomer(invoice.customerId);
          }
          this.isLoading = false;
        },
        error: () => {
          this.toaster.error('Failed to load invoice');
          this.isLoading = false;
          this.router.navigate(['/invoice-management']);
        }
      });
  }

  private loadCustomer(customerId: string): void {
    this.customerService.get(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customer) => this.customer = customer,
        error: () => {
          // ✅ CORRECT METHOD NAME: warn (NOT warning)
          this.toaster.warn('Customer information unavailable');
        }
      });
  }

  getStatusBadgeClass(status: any): string {
    const statusNum = typeof status === 'string' ? parseInt(status) : status;
    const badges: Record<number, string> = {
      [InvoiceStatus.Draft]: 'secondary',
      [InvoiceStatus.Sent]: 'warning',
      [InvoiceStatus.Paid]: 'success',
      [InvoiceStatus.Overdue]: 'danger'
    };
    return `badge bg-${badges[statusNum] || 'secondary'}`;
  }

  getStatusText(status: any): string {
    const statusNum = typeof status === 'string' ? parseInt(status) : status;
    switch (statusNum) {
      case InvoiceStatus.Draft: return 'Draft';
      case InvoiceStatus.Sent: return 'Sent';
      case InvoiceStatus.Paid: return 'Paid';
      case InvoiceStatus.Overdue: return 'Overdue';
      default: return 'Unknown';
    }
  }

  canEdit(): boolean {
    if (!this.invoice) return false;
    // ✅ Convert to number to avoid type errors
    const statusNum = typeof this.invoice.status === 'string' 
      ? parseInt(this.invoice.status) 
      : this.invoice.status;
    return this.permissions.canEditInvoice(statusNum);
  }

  markAsPaid(): void {
    if (!this.invoice || !this.permissions.canUpdateStatus) return;

    this.confirmationService.success(
      'Mark as Paid',
      'Are you sure you want to mark this invoice as paid?'
    ).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateInvoiceStatus(InvoiceStatus.Paid);
      }
    });
  }

  markAsSent(): void {
    if (!this.invoice || !this.permissions.canUpdateStatus) return;

    this.confirmationService.info(
      'Mark as Sent',
      'Are you sure you want to mark this invoice as sent?'
    ).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateInvoiceStatus(InvoiceStatus.Sent);
      }
    });
  }

  private updateInvoiceStatus(newStatus: number): void {
    if (!this.invoice) return;

    this.isProcessing = true;
    
    const updateDto = {
      status: newStatus
    };
    
    this.invoiceService.update(this.invoice.id, updateDto as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toaster.success('Invoice status updated successfully');
          this.loadInvoice(this.invoice!.id);
        },
        error: () => {
          this.toaster.error('Failed to update invoice status');
          this.isProcessing = false;
        }
      });
  }

  deleteInvoice(): void {
    if (!this.invoice || !this.permissions.hasDelete) return;

    this.confirmationService.warn(
      'Are you sure?',
      'Do you really want to delete this invoice?',
      { messageLocalizationParams: [this.invoice.number || ''] }
    ).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.isProcessing = true;
        this.invoiceService.delete(this.invoice.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.toaster.success('Invoice deleted successfully');
              this.router.navigate(['/invoice-management']);
            },
            error: () => {
              this.toaster.error('Failed to delete invoice');
              this.isProcessing = false;
            }
          });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/invoice-management']);
  }

  getSubtotal(): number {
    if (!this.invoice?.lineItems) return 0;
    return this.invoice.lineItems.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice), 
      0
    );
  }

  getTax(): number {
    return this.getSubtotal() * 0.1;
  }

  getGrandTotal(): number {
    return this.getSubtotal() + this.getTax();
  }
}