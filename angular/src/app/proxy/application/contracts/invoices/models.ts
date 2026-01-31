import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';

export interface CreateUpdateInvoiceDto {
  customerId?: string;
  number?: string;
  invoiceDate?: string;
  dueDate?: string;
  status?: string;
  lineItems?: CreateUpdateLineItemDto[];
}

export interface CreateUpdateLineItemDto {
  description?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface InvoiceDto extends AuditedEntityDto<string> {
  customerId?: string;
  number?: string;
  invoiceDate?: string;
  dueDate?: string;
  status?: string;
  lineItems?: LineItemDto[];
  subTotal?: number;
  tax?: number;
  grandTotal?: number;
}

export interface LineItemDto extends EntityDto<string> {
  invoiceId?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
}
