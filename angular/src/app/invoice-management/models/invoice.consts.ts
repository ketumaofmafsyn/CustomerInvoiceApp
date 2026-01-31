/**
 * Invoice Management Constants
 * Matches backend: CustomerInvoiceApp.Domain/Invoices/InvoiceStatus.cs
 */

// Invoice Status Enum (matches backend enum values)
export enum InvoiceStatus {
  Draft = 0,
  Sent = 1,
  Paid = 2,
  Overdue = 3
}

// Permission Constants
export const InvoiceManagementPermissions = {
  Default: 'CustomerInvoiceApp.InvoiceManagement',
  Create: 'CustomerInvoiceApp.InvoiceManagement.Create',
  Edit: 'CustomerInvoiceApp.InvoiceManagement.Edit',
  Delete: 'CustomerInvoiceApp.InvoiceManagement.Delete',
  UpdateStatus: 'CustomerInvoiceApp.InvoiceManagement.UpdateStatus'
};