import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CareerPageApiService, SaveCareerPageRequest } from '../../core/services/career-page-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-career-page-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './career-page-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerPageAdminComponent implements OnInit {
  private readonly api = inject(CareerPageApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    heroMetaLine: ['', Validators.required],
    primaryCtaLabel: ['', Validators.required],
    primaryCtaLink: ['', Validators.required],
    responseTime: ['', Validators.required],
    heroVideoFileName: [''],
    heroVideo: [null as File | null],
  });

  ngOnInit(): void {
    this.load();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ heroVideo: file });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const request: SaveCareerPageRequest = {
      headerEyebrow: value.headerEyebrow ?? '',
      headerTitle: value.headerTitle ?? '',
      headerSubtitle: value.headerSubtitle ?? '',
      heroVideoFileName: value.heroVideoFileName ?? null,
      heroVideoFile: value.heroVideo ?? null,
      heroMetaLine: value.heroMetaLine ?? '',
      primaryCtaLabel: value.primaryCtaLabel ?? '',
      primaryCtaLink: value.primaryCtaLink ?? '',
      responseTime: value.responseTime ?? '',
    };

    this.loading.set(true);
    this.api.update(request).subscribe({
      next: page => {
        this.loading.set(false);
        this.toast.show('Career hero saved', 'success');
        this.form.patchValue({ heroVideoFileName: page.heroVideo?.fileName ?? '' });
      },
      error: () => {
        this.loading.set(false);
        this.toast.show('Failed to save career hero', 'error');
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.fetch().subscribe({
      next: page => {
        this.form.patchValue({
          headerEyebrow: page.headerEyebrow,
          headerTitle: page.headerTitle,
          headerSubtitle: page.headerSubtitle,
          heroMetaLine: page.heroMetaLine,
          primaryCtaLabel: page.primaryCtaLabel,
          primaryCtaLink: page.primaryCtaLink,
          responseTime: page.responseTime,
          heroVideoFileName: page.heroVideo?.fileName ?? '',
          heroVideo: null,
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.show('Unable to load career hero content', 'error');
      },
    });
  }
}
