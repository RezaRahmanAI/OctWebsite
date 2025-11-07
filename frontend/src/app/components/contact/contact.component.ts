import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { LeadRequest } from '../../models/lead-request.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly submitting = signal(false);
  readonly statusType = signal<'success' | 'error' | null>(null);
  readonly statusMessage = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as LeadRequest;

    this.submitting.set(true);
    this.statusType.set(null);
    this.statusMessage.set(null);

    this.api
      .submitLead(payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.statusType.set('success');
          this.statusMessage.set('Thanks for reaching out! Our consultants will contact you within one business day.');
          this.form.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.statusType.set('error');
          if (error.status === 400 && error.error?.errors) {
            const messages = Object.values(error.error.errors).flat() as string[];
            this.statusMessage.set(messages.join(' '));
          } else {
            this.statusMessage.set('Something went wrong. Please email hello@objectcanvas.com and we will assist you.');
          }
        }
      });
  }
}
