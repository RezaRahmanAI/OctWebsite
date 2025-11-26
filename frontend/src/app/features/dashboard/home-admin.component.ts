import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../core/services';
import {
  HomePageApiService,
  HomePageModel,
  HomeMetricModel,
  HomeTestimonialModel,
  SaveHomePageRequest,
} from '../../core/services/home-page-api.service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class HomeAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(HomePageApiService);
  private readonly toast = inject(ToastService);

  private heroVideo: File | null = null;
  private heroPoster: File | null = null;
  private testimonialImages: (File | null)[] = [];

  readonly loading = signal(false);

  readonly heroForm = this.fb.group({
    badge: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    primaryLabel: ['', Validators.required],
    primaryLink: [''],
    primaryFragment: [''],
    secondaryLabel: ['', Validators.required],
    secondaryLink: [''],
    secondaryFragment: [''],
    highlightTitle: ['', Validators.required],
    highlightDescription: ['', Validators.required],
    highlightList: this.fb.array([this.fb.control('', Validators.required)]),
    videoFileName: [''],
    posterFileName: [''],
    featureEyebrow: ['', Validators.required],
    featureTitle: ['', Validators.required],
    featureDescription: ['', Validators.required],
    metrics: this.fb.array([]),
    partnerLabel: ['', Validators.required],
    partnerDescription: ['', Validators.required],
  });

  readonly trustForm = this.fb.group({
    tagline: ['', Validators.required],
    companies: this.fb.array([this.fb.control('', Validators.required)]),
    stats: this.fb.array([]),
  });

  readonly testimonialForm = this.fb.array([]);

  ngOnInit(): void {
    this.load();
  }

  get highlightList(): FormArray {
    return this.heroForm.get('highlightList') as FormArray;
  }

  get metrics(): FormArray {
    return this.heroForm.get('metrics') as FormArray;
  }

  get companies(): FormArray {
    return this.trustForm.get('companies') as FormArray;
  }

  get stats(): FormArray {
    return this.trustForm.get('stats') as FormArray;
  }

  addHighlight(value = ''): void {
    this.highlightList.push(this.fb.control(value, Validators.required));
  }

  removeHighlight(index: number): void {
    this.highlightList.removeAt(index);
  }

  addMetric(metric?: HomeMetricModel): void {
    this.metrics.push(
      this.fb.group({
        label: [metric?.label ?? '', Validators.required],
        value: [metric?.value ?? '', Validators.required],
        theme: [metric?.theme ?? 'accent', Validators.required],
      })
    );
  }

  removeMetric(index: number): void {
    this.metrics.removeAt(index);
  }

  addCompany(value = ''): void {
    this.companies.push(this.fb.control(value, Validators.required));
  }

  removeCompany(index: number): void {
    this.companies.removeAt(index);
  }

  addStat(stat?: { label: string; value: number; suffix?: string | null; decimals?: number | null }): void {
    this.stats.push(
      this.fb.group({
        label: [stat?.label ?? '', Validators.required],
        value: [stat?.value ?? 0, Validators.required],
        suffix: [stat?.suffix ?? ''],
        decimals: [stat?.decimals ?? null],
      })
    );
  }

  removeStat(index: number): void {
    this.stats.removeAt(index);
  }

  addTestimonial(testimonial?: HomeTestimonialModel): void {
    this.testimonialForm.push(
      this.fb.group({
        quote: [testimonial?.quote ?? '', Validators.required],
        name: [testimonial?.name ?? '', Validators.required],
        title: [testimonial?.title ?? '', Validators.required],
        location: [testimonial?.location ?? '', Validators.required],
        rating: [testimonial?.rating ?? 5, [Validators.required]],
        type: [testimonial?.type ?? 'client', Validators.required],
        imageFileName: [testimonial?.image?.fileName ?? testimonial?.image?.url ?? ''],
      })
    );
    this.testimonialImages.push(null);
  }

  removeTestimonial(index: number): void {
    this.testimonialForm.removeAt(index);
    this.testimonialImages.splice(index, 1);
  }

  onHeroVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.heroVideo = file;
  }

  onHeroPosterSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.heroPoster = file;
  }

  onTestimonialImageSelected(index: number, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.testimonialImages[index] = file;
  }

  submit(): void {
    if (this.heroForm.invalid || this.trustForm.invalid || this.testimonialForm.invalid) {
      this.heroForm.markAllAsTouched();
      this.trustForm.markAllAsTouched();
      this.testimonialForm.markAllAsTouched();
      return;
    }

    const request = this.toRequest();
    this.loading.set(true);
    this.api.update(request).subscribe({
      next: page => {
        this.apply(page);
        this.toast.show('Home page saved', 'success');
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Failed to save home page', 'error');
        this.loading.set(false);
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.fetch().subscribe({
      next: page => {
        this.apply(page);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load home page content', 'error');
        this.loading.set(false);
      },
    });
  }

  private apply(page: HomePageModel): void {
    this.heroForm.patchValue({
      badge: page.hero.badge,
      title: page.hero.title,
      description: page.hero.description,
      primaryLabel: page.hero.primaryCta.label,
      primaryLink: page.hero.primaryCta.routerLink ?? '',
      primaryFragment: page.hero.primaryCta.fragment ?? '',
      secondaryLabel: page.hero.secondaryCta.label,
      secondaryLink: page.hero.secondaryCta.routerLink ?? '',
      secondaryFragment: page.hero.secondaryCta.fragment ?? '',
      highlightTitle: page.hero.highlightCard.title,
      highlightDescription: page.hero.highlightCard.description,
      videoFileName: page.hero.video?.fileName ?? '',
      posterFileName: page.hero.poster?.fileName ?? '',
      featureEyebrow: page.hero.featurePanel.eyebrow,
      featureTitle: page.hero.featurePanel.title,
      featureDescription: page.hero.featurePanel.description,
      partnerLabel: page.hero.featurePanel.partner.label,
      partnerDescription: page.hero.featurePanel.partner.description,
    });

    this.heroVideo = null;
    this.heroPoster = null;
    this.testimonialImages = [];

    this.highlightList.clear();
    page.hero.highlightList.forEach(item => this.addHighlight(item));

    this.metrics.clear();
    page.hero.featurePanel.metrics.forEach(metric => this.addMetric(metric));

    this.trustForm.patchValue({
      tagline: page.trust.tagline,
    });
    this.companies.clear();
    page.trust.companies.forEach(company => this.addCompany(company));

    this.stats.clear();
    page.trust.stats.forEach(stat => this.addStat(stat));

    this.testimonialForm.clear();
    page.testimonials.forEach(testimonial => this.addTestimonial(testimonial));
  }

  private toRequest(): SaveHomePageRequest {
    return {
      hero: {
        badge: this.heroForm.value.badge ?? '',
        title: this.heroForm.value.title ?? '',
        description: this.heroForm.value.description ?? '',
        primaryCta: {
          label: this.heroForm.value.primaryLabel ?? '',
          routerLink: this.heroForm.value.primaryLink || null,
          fragment: this.heroForm.value.primaryFragment || null,
        },
        secondaryCta: {
          label: this.heroForm.value.secondaryLabel ?? '',
          routerLink: this.heroForm.value.secondaryLink || null,
          fragment: this.heroForm.value.secondaryFragment || null,
        },
        highlightCard: {
          title: this.heroForm.value.highlightTitle ?? '',
          description: this.heroForm.value.highlightDescription ?? '',
        },
        highlightList: this.highlightList.controls.map(control => control.value ?? ''),
        videoFileName: this.heroForm.value.videoFileName || null,
        videoFile: this.heroVideo,
        posterFileName: this.heroForm.value.posterFileName || null,
        posterFile: this.heroPoster,
        featurePanel: {
          eyebrow: this.heroForm.value.featureEyebrow ?? '',
          title: this.heroForm.value.featureTitle ?? '',
          description: this.heroForm.value.featureDescription ?? '',
          metrics: this.metrics.controls.map(control => ({
            label: control.value.label ?? '',
            value: control.value.value ?? '',
            theme: control.value.theme ?? 'accent',
          })),
          partner: {
            label: this.heroForm.value.partnerLabel ?? '',
            description: this.heroForm.value.partnerDescription ?? '',
          },
        },
      },
      trust: {
        tagline: this.trustForm.value.tagline ?? '',
        companies: this.companies.controls.map(control => control.value ?? ''),
        stats: this.stats.controls.map(control => ({
          label: control.value.label ?? '',
          value: Number(control.value.value ?? 0),
          suffix: control.value.suffix || null,
          decimals: control.value.decimals ?? null,
        })),
      },
      testimonials: this.testimonialForm.controls.map((control, index) => ({
        quote: control.value.quote ?? '',
        name: control.value.name ?? '',
        title: control.value.title ?? '',
        location: control.value.location ?? '',
        rating: Number(control.value.rating ?? 5),
        type: control.value.type ?? 'client',
        image: null,
        imageFileName: control.value.imageFileName || null,
        imageFile: this.testimonialImages[index],
      })),
    } satisfies SaveHomePageRequest;
  }
}
