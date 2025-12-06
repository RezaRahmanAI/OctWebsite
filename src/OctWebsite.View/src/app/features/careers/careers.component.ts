import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CareersApiService, CareerApplicationRequest, JobPosting } from '../../core/services/careers-api.service';
import { CareerPageApiService, type CareerPageModel } from '../../core/services/career-page-api.service';
import { ToastService } from '../../core/services/toast.service';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { SectionHeadingComponent, SectionHeadingCta } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AssetUrlPipe, SectionHeadingComponent],
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareersComponent implements OnInit, AfterViewInit {
  private readonly careersApi = inject(CareersApiService);
  private readonly careerPageApi = inject(CareerPageApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly document = inject(DOCUMENT);

  @ViewChild('heroVideo')
  set heroVideoRef(video: ElementRef<HTMLVideoElement> | undefined) {
    this.heroVideo = video;
    this.autoplayVideo();
  }
  private heroVideo?: ElementRef<HTMLVideoElement>;

  protected readonly openings = signal<JobPosting[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected selectedCv: File | null = null;

  protected readonly careerPage = computed(() => {
    const page = this.careerPageApi.content();
    return page ? this.mapFromApi(page) : null;
  });

  protected readonly heroVideoUrl = computed(() => this.careerPage()?.heroVideoUrl ?? null);

  protected readonly heroCtas = computed<SectionHeadingCta[]>(() => {
    const page = this.careerPage();
    if (!page) return [];

    return [
      {
        label: page.primaryCtaLabel,
        routerLink: page.primaryCtaLink,
      },
      {
        label: 'Browse roles ↓',
        onClick: () => this.scrollToRoles(),
        variant: 'secondary',
      },
    ];
  });

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
    this.careerPageApi.load();
    this.fetchOpenings();
  }

  ngAfterViewInit(): void {
    this.autoplayVideo();
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

  private scrollToRoles(): void {
    const el = this.document.getElementById('open-roles');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  private autoplayVideo(): void {
    queueMicrotask(() => this.tryAutoplay(this.heroVideo?.nativeElement));
  }

  private tryAutoplay(video?: HTMLVideoElement | null): void {
    if (!video) return;

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    if (video.paused) {
      void video.play().catch(() => undefined);
    }
  }

  private mapFromApi(model: CareerPageModel) {
    return {
      header: {
        eyebrow: model.headerEyebrow,
        title: model.headerTitle,
        subtitle: model.headerSubtitle,
      },
      heroVideoUrl: model.heroVideo?.url ?? model.heroVideo?.fileName ?? null,
      heroMetaLine: model.heroMetaLine,
      primaryCtaLabel: model.primaryCtaLabel,
      primaryCtaLink: model.primaryCtaLink,
      responseTime: model.responseTime,
    } as const;
  }
}
