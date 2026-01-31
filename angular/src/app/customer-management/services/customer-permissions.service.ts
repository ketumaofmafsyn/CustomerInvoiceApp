import { Injectable } from '@angular/core';
import { PermissionService } from '@abp/ng.core';
import { CustomerManagementPermissions } from '../models/customer.consts';

@Injectable({ providedIn: 'root' })
export class CustomerPermissionsService {
  constructor(private permissionService: PermissionService) {}

  get hasCreate() { return this.permissionService.getGrantedPolicy(CustomerManagementPermissions.Create); }
  get hasEdit() { return this.permissionService.getGrantedPolicy(CustomerManagementPermissions.Edit); }
  get hasDelete() { return this.permissionService.getGrantedPolicy(CustomerManagementPermissions.Delete); }
}