import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ContactSubmissionsApiService } from '../../../../core/services/contact-submissions-api.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-home-contact',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './home-contact.component.html',
  styleUrl: './home-contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContactComponent {
  @Input({ required: true }) data!: HomeContent['contact'];

  @Input() formOptions: string[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly submissionsApi = inject(ContactSubmissionsApiService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    phone: ['', [Validators.maxLength(25), Validators.pattern(/^[+]?[-0-9\s()]{7,25}$/)]],
    interest: ['', [Validators.maxLength(100)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  private readonly defaultFormOptions = [
    'Digital Marketing',
    'Software Development',
    'Website Building',
    'ObjectCanvas Academy Courses',
    'General Inquiry',
  ];

  protected readonly options = computed(() => {
    const provided = this.formOptions?.filter(Boolean) ?? [];
    return provided.length > 0 ? provided : this.defaultFormOptions;
  });

  protected fieldInvalid(field: 'name' | 'email' | 'phone' | 'interest' | 'message', error?: string): boolean {
    const control = this.contactForm.get(field);
    if (!control) {
      return false;
    }

    if (error) {
      return control.touched && control.hasError(error);
    }

    return control.touched && control.invalid;
  }

  protected markRequiredErrors(): void {
    this.contactForm.markAllAsTouched();
  }

  submit(): void {
    if (this.contactForm.invalid) {
      this.markRequiredErrors();
      this.error.set('Please correct the highlighted fields.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.submitted.set(false);

    const request = {
      name: this.contactForm.value.name ?? '',
      email: this.contactForm.value.email ?? '',
      phone: this.contactForm.value.phone ?? null,
      interest: this.contactForm.value.interest ?? null,
      message: this.contactForm.value.message ?? '',
    };

    this.submissionsApi.submit(request).subscribe({
      next: (response) => {
        const success = response === true || response === 1;

        if (!success) {
          this.loading.set(false);
          this.error.set('Unable to submit your message. Please try again.');
          this.toast.show('Failed to submit contact form', 'error');
          return;
        }

        this.loading.set(false);
        this.submitted.set(true);
        this.contactForm.reset();
        this.toast.show('Thanks! We have received your message.', 'success');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to submit your message. Please try again.');
        this.toast.show('Failed to submit contact form', 'error');
      },
    });
  }
}
