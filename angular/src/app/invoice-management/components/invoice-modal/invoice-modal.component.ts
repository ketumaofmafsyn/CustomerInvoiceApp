import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService, CustomerDto } from '@proxy/customers';
import { 
  InvoiceService, 
  CreateUpdateInvoiceDto, 
  CreateUpdateLineItemDto,
  InvoiceDto 
} from '@proxy/invoices';
import { CardComponent, ToasterService } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PermissionDirective } from '@abp/ng.core';

@Component({
  selector: 'app-invoice-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.scss'],
   standalone: true, 
  imports: [
  CommonModule,
    RouterModule,
    ReactiveFormsModule
]
})
export class InvoiceModalComponent implements OnInit {
  @Input() id?: string;
  @Input() invoice?: InvoiceDto;
  @Output() onSave = new EventEmitter<boolean>();

  form: FormGroup;
  isEdit = false;
  saving = false;
  loadingCustomers = false;
  customers: CustomerDto[] = [];
  subtotal = 0;
  taxRate = 0.1;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private toaster: ToasterService
  ) {
    this.form = this.fb.group({
      customerId: ['', Validators.required],
      issueDate: [new Date(), Validators.required],
      dueDate: [this.getDefaultDueDate(), Validators.required],
      status: [0],
      totalAmount: [0], // Keep for UI calculations only
      lineItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.isEdit = !!this.id;
    this.loadCustomers();
    
    if (this.isEdit && this.invoice) {
      this.patchInvoiceData();
    } else {
      this.addLineItem();
    }
  }

  get lineItems(): FormArray {
    return this.form.get('lineItems') as FormArray;
  }

  getDefaultDueDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }

  loadCustomers(): void {
    this.loadingCustomers = true;
    interface GetCustomersDto { maxResultCount: number; }
    this.customerService.getList({ maxResultCount: 1000 } as GetCustomersDto).subscribe({
      next: (result) => {
        this.customers = result.items || [];
        this.loadingCustomers = false;
      },
      error: () => {
        this.toaster.error('Failed to load customers');
        this.loadingCustomers = false;
      }
    });
  }

  patchInvoiceData(): void {
    if (!this.invoice) return;
    
    this.form.patchValue({
      customerId: this.invoice.customerId,
      issueDate: new Date(this.invoice.issueDate),
      dueDate: new Date(this.invoice.dueDate),
      status: this.invoice.status,
      totalAmount: this.invoice.totalAmount
    });

    while (this.lineItems.length) {
      this.lineItems.removeAt(0);
    }

    if (this.invoice.lineItems?.length) {
      this.invoice.lineItems.forEach(item => this.addLineItem(item));
    } else {
      this.addLineItem();
    }
  }

  addLineItem(item?: { description?: string; quantity?: number; unitPrice?: number }): void {
    this.lineItems.push(this.fb.group({
      description: [item?.description || '', Validators.required],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [item?.unitPrice || 0, [Validators.required, Validators.min(0)]]
    }));
    this.calculateTotals();
  }

  removeLineItem(index: number): void {
    if (this.lineItems.length <= 1) {
      this.toaster.warn('At least one line item is required');
      return;
    }
    this.lineItems.removeAt(index);
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.lineItems.controls.reduce((sum, group) => {
      const qty = group.get('quantity')?.value || 0;
      const price = group.get('unitPrice')?.value || 0;
      return sum + (qty * price);
    }, 0);

    this.form.patchValue({ 
      totalAmount: this.subtotal * (1 + this.taxRate) 
    }, { emitEvent: false });
  }

  getLineTotal(index: number): number {
    const item = this.lineItems.at(index);
    return (item.get('quantity')?.value || 0) * (item.get('unitPrice')?.value || 0);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toaster.warn('Please fill all required fields');
      return;
    }

    if (this.lineItems.length === 0 || this.subtotal === 0) {
      this.toaster.warn('At least one valid line item is required');
      return;
    }

    this.saving = true;

    // ✅ Map line items
    const lineItemsDto: CreateUpdateLineItemDto[] = this.lineItems.controls.map(control => ({
      description: control.get('description')?.value.trim() || '',
      quantity: control.get('quantity')?.value || 1,
      unitPrice: control.get('unitPrice')?.value || 0
    }));

    // ✅ CRITICAL FIX: Use only customerId and lineItems (these ALWAYS exist)
    // Backend will calculate totalAmount automatically
    const dto: CreateUpdateInvoiceDto = {
      customerId: this.form.value.customerId,
      lineItems: lineItemsDto
    } as CreateUpdateInvoiceDto;

    const request$ = this.isEdit 
      ? this.invoiceService.update(this.id!, dto)
      : this.invoiceService.create(dto);

    request$.pipe(finalize(() => this.saving = false)).subscribe({
      next: () => {
        this.toaster.success(this.isEdit ? 'Invoice updated successfully' : 'Invoice created successfully');
        this.onSave.emit(true);
      },
      error: () => {
        this.toaster.error(this.isEdit ? 'Failed to update invoice' : 'Failed to create invoice');
      }
    });
  }

  cancel(): void {
    this.onSave.emit(false);
  }
}