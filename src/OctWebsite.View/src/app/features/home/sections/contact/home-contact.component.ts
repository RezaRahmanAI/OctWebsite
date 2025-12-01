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
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    interest: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
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

  submit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.error.set('Please fill out the required fields.');
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
      next: () => {
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
