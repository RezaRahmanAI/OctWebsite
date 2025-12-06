import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CareersApiService, CareerApplicationRequest, JobPosting } from '../../core/services/careers-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareersComponent implements OnInit {
  private readonly careersApi = inject(CareersApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly openings = signal<JobPosting[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected selectedCv: File | null = null;

  protected toBulletPoints(summary: string): string[] {
    const points = summary
      .split(/\r?\n|•/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    return points.length > 0 ? points : summary.trim() ? [summary.trim()] : [];
  }

  protected readonly applicationForm = this.fb.group({
    jobPostingId: ['', Validators.required],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: [''],
  });

  ngOnInit(): void {
    this.fetchOpenings();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCv = input.files[0];
    }
  }

  submit(): void {
    if (this.applicationForm.invalid || !this.selectedCv) {
      this.applicationForm.markAllAsTouched();
      this.error.set('Please complete all required fields and attach your CV.');
      return;
    }

    const request: CareerApplicationRequest = {
      jobPostingId: this.applicationForm.value.jobPostingId ?? '',
      fullName: this.applicationForm.value.fullName ?? '',
      email: this.applicationForm.value.email ?? '',
      phone: this.applicationForm.value.phone ?? '',
      message: this.applicationForm.value.message ?? '',
      cv: this.selectedCv,
    };

    this.submitting.set(true);
    this.error.set(null);

    this.careersApi.submitApplication(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.show('Application submitted! We will be in touch soon.', 'success');
        this.applicationForm.reset({ jobPostingId: this.applicationForm.value.jobPostingId });
        this.selectedCv = null;
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Unable to submit your application right now. Please try again.');
        this.toast.show('Failed to submit application', 'error');
      },
    });
  }

  private fetchOpenings(): void {
    this.loading.set(true);
    this.careersApi.getOpenings().subscribe({
      next: (openings) => {
        this.openings.set(openings);
        this.loading.set(false);
        if (openings.length > 0) {
          this.applicationForm.controls.jobPostingId.setValue(openings[0].id);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load open positions at the moment.');
      },
    });
  }
}
