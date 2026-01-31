import { Injectable } from '@angular/core';
import { PermissionService } from '@abp/ng.core';
import { InvoiceManagementPermissions } from '../models/invoice.consts';


@Injectable({ providedIn: 'root' })
export class InvoicePermissionsService {
  constructor(private permissionService: PermissionService) {}

  get hasCreate(): boolean {
    return this.permissionService.getGrantedPolicy(InvoiceManagementPermissions.Create);
  }

  get hasEdit(): boolean {
    return this.permissionService.getGrantedPolicy(InvoiceManagementPermissions.Edit);
  }

  get hasDelete(): boolean {
    return this.permissionService.getGrantedPolicy(InvoiceManagementPermissions.Delete);
  }

  get canUpdateStatus(): boolean {
    return this.permissionService.getGrantedPolicy(InvoiceManagementPermissions.UpdateStatus);
  }

  // Helper method for status-based edit permissions
  canEditInvoice(status: number): boolean {
    // Only allow editing if status is Draft (0) AND has edit permission
    return status === 0 && this.hasEdit;
  }
}