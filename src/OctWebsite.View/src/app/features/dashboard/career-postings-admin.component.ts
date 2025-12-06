import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CareersApiService, JobPosting, SaveJobPostingRequest } from '../../core/services/careers-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-career-postings-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './career-postings-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerPostingsAdminComponent implements OnInit {
  private readonly api = inject(CareersApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly postings = signal<JobPosting[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected editingId: string | null = null;

  protected readonly postingForm = this.fb.group({
    title: ['', Validators.required],
    location: ['', Validators.required],
    employmentType: ['', Validators.required],
    summary: ['', [Validators.required, Validators.minLength(10)]],
    detailsUrl: ['', Validators.required],
    active: [true, Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  startCreate(): void {
    this.editingId = null;
    this.postingForm.reset({ active: true });
  }

  startEdit(posting: JobPosting): void {
    this.editingId = posting.id;
    this.postingForm.patchValue({
      title: posting.title,
      location: posting.location,
      employmentType: posting.employmentType,
      summary: posting.summary,
      detailsUrl: posting.detailsUrl ?? '',
      active: posting.active,
    });
  }

  save(): void {
    if (this.postingForm.invalid) {
      this.postingForm.markAllAsTouched();
      return;
    }

    const request: SaveJobPostingRequest = {
      title: this.postingForm.value.title ?? '',
      location: this.postingForm.value.location ?? '',
      employmentType: this.postingForm.value.employmentType ?? '',
      summary: this.postingForm.value.summary ?? '',
      detailsUrl: this.postingForm.value.detailsUrl ?? '',
      active: this.postingForm.value.active ?? false,
    };

    this.saving.set(true);

    const action$ = this.editingId
      ? this.api.updatePosting(this.editingId, request)
      : this.api.createPosting(request);

    action$.subscribe({
      next: () => {
        this.toast.show('Career posting saved', 'success');
        this.saving.set(false);
        this.startCreate();
        this.load();
      },
      error: () => {
        this.toast.show('Unable to save posting', 'error');
        this.saving.set(false);
      },
    });
  }

  delete(posting: JobPosting): void {
    if (!confirm(`Delete the role "${posting.title}"?`)) {
      return;
    }

    this.api.deletePosting(posting.id).subscribe({
      next: () => {
        this.toast.show('Posting removed', 'success');
        this.load();
      },
      error: () => this.toast.show('Failed to delete posting', 'error'),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (posts) => {
        this.postings.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load career postings', 'error');
        this.loading.set(false);
      },
    });
  }
}
