import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService, CustomerDto } from '@proxy/customers';
import { ToasterService } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-modal',
  template: `
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Create Customer</h5>
        <button type="button" class="btn-close" (click)="close()"></button>
      </div>
      
      <div class="modal-body">
        <form [formGroup]="form">
          <div class="mb-3">
            <label class="form-label">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control" formControlName="name" required>
            <div *ngIf="form.get('name')?.invalid && form.get('name')?.touched" class="text-danger">
              Name is required
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Email <span class="text-danger">*</span></label>
            <input type="email" class="form-control" formControlName="email" required>
            <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-danger">
              Valid email is required
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-control" formControlName="phone">
          </div>
          <div class="mb-3">
            <label class="form-label">Billing Address</label>
            <textarea class="form-control" formControlName="billingAddress" rows="3"></textarea>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" (click)="close()">Cancel</button>
        <button 
          class="btn btn-primary" 
          [disabled]="form.invalid || saving"
          (click)="save()">
          <span *ngIf="saving">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Saving...
          </span>
          <span *ngIf="!saving">Save Customer</span>
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CustomerModalComponent implements OnInit {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toaster: ToasterService,
    private router: Router // ✅ Added Router for navigation
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(128)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      phone: [''],
      billingAddress: ['']
    });
  }

  ngOnInit(): void {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    this.customerService.create(this.form.value).pipe(
      finalize(() => this.saving = false)
    ).subscribe({
      next: () => {
        this.toaster.success('Customer created successfully');
        this.close();
      },
      error: (err) => {
        this.toaster.error('Failed to create customer');
        console.error('Create customer error:', err);
      }
    });
  }

  close(): void {
    // ✅ Navigate back to customer list instead of closing modal
    this.router.navigate(['/customer-management']);
  }
}