import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvoiceService, InvoiceDto } from '@proxy/invoices';
import { CustomerService } from '@proxy/customers';
import { InvoicePermissionsService } from '../../services/invoice-permissions.service';
import { Confirmation, ConfirmationService, ToasterService, ModalRefService } from '@abp/ng.theme.shared';
import { PagedResultDto, PagedAndSortedResultRequestDto, PermissionDirective } from '@abp/ng.core';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';
import { InvoiceStatus } from '../../models/invoice.consts';

interface GetInvoiceListDto extends PagedAndSortedResultRequestDto {
  filter?: string;
  status?: number;
}

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PermissionDirective,  
  ]
})
export class InvoiceListComponent implements OnInit {
  invoices: PagedResultDto<InvoiceDto> = new PagedResultDto<InvoiceDto>();
  customers = new Map<string, string>();
  isLoading = false;
  searchTerm = '';
  selectedStatus: number | null = null;
  readonly InvoiceStatus = InvoiceStatus;
  pageSize = 10;
  currentPage = 1;
  editingInvoice: InvoiceDto | null = null;
  isInvoiceModalOpen = false;

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private toaster: ToasterService,
    private modalRefService: ModalRefService, // ✅ Use this for modal
    public permissions: InvoicePermissionsService
  ) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices(page = 1): void {
    this.currentPage = page;
    this.isLoading = true;

    const params: GetInvoiceListDto = {
      maxResultCount: this.pageSize,
      skipCount: (page - 1) * this.pageSize,
      filter: this.searchTerm || undefined,
      status: this.selectedStatus !== null ? this.selectedStatus : undefined
    };

    this.invoiceService.getList(params as PagedAndSortedResultRequestDto).subscribe({
      next: res => {
        this.invoices = res;
        this.loadCustomerNames();
        this.isLoading = false;
      },
      error: () => {
        this.toaster.error('Failed to load invoices');
        this.isLoading = false;
      }
    });
  }

  loadCustomerNames(): void {
    this.invoices.items?.forEach(inv => {
      if (!this.customers.has(inv.customerId) && inv.customerId) {
        this.customerService.get(inv.customerId).subscribe({
          next: cust => this.customers.set(inv.customerId, cust.name),
          error: () => this.customers.set(inv.customerId, 'Unknown')
        });
      }
    });
  }

  getCustomerName(id: string): string {
    return this.customers.get(id) || 'Loading...';
  }

  getStatusBadge(status: number): string {
    const badges = {
      [InvoiceStatus.Draft]: 'secondary',
      [InvoiceStatus.Sent]: 'warning',
      [InvoiceStatus.Paid]: 'success',
      [InvoiceStatus.Overdue]: 'danger'
    };
    return `badge bg-${badges[status as keyof typeof badges] || 'secondary'}`;
  }

  getStatusText(status: number): string {
    const texts = {
      [InvoiceStatus.Draft]: 'Draft',
      [InvoiceStatus.Sent]: 'Sent',
      [InvoiceStatus.Paid]: 'Paid',
      [InvoiceStatus.Overdue]: 'Overdue'
    };
    return texts[status as keyof typeof texts] || 'Unknown';
  }

  onStatusChange(): void {
    this.loadInvoices(1);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadInvoices(1);
  }

  openCreateModal(): void {
    this.editingInvoice = null;
    this.isInvoiceModalOpen = true;
  }

  openEditModal(invoice: InvoiceDto): void {
    this.editingInvoice = invoice;
    this.isInvoiceModalOpen = true;
  }

  onInvoiceSaved(saved: boolean): void {
    this.isInvoiceModalOpen = false;
    if (saved) this.loadInvoices(this.currentPage);
  }

  deleteInvoice(id: string, number: string): void {
    this.confirmationService.warn(
      'Are you sure?',
      `Delete invoice ${number}?`,
      { messageLocalizationParams: [number] }
    ).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.invoiceService.delete(id).subscribe({
          next: () => {
            this.toaster.success('Invoice deleted successfully');
            this.loadInvoices(this.currentPage);
          },
          error: () => this.toaster.error('Failed to delete invoice')
        });
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadInvoices(1);
  }
}
