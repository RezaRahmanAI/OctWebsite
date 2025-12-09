import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../core/services';
import {
  HomePageApiService,
  HomePageModel,
  HomeMetricModel,
  HomeTestimonialModel,
  SaveHomeHeroRequest,
  SaveHomeTrustRequest,
  SaveHomeTestimonialRequest,
} from '../../core/services/home-page-api.service';

type MetricFormGroup = FormGroup<{
  label: FormControl<string>;
  value: FormControl<string>;
  theme: FormControl<string>;
}>;

type StatFormGroup = FormGroup<{
  label: FormControl<string>;
  value: FormControl<number>;
  suffix: FormControl<string | null>;
  decimals: FormControl<number | null>;
}>;

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
  private trustLogoFiles: (File | null)[] = [null];
  private testimonialImage: File | null = null;

  readonly loading = signal(false);
  readonly savingHero = signal(false);
  readonly savingTrust = signal(false);
  readonly savingTestimonials = signal(false);
  readonly editingTestimonialId = signal<string | null>(null);
  readonly testimonials = signal<HomeTestimonialModel[]>([]);

  readonly heroForm = this.fb.group({
    badge: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    title: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    description: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    primaryLabel: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    primaryLink: this.fb.control<string>('', { nonNullable: true }),
    primaryFragment: this.fb.control<string>('', { nonNullable: true }),
    secondaryLabel: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    secondaryLink: this.fb.control<string>('', { nonNullable: true }),
    secondaryFragment: this.fb.control<string>('', { nonNullable: true }),
    highlightTitle: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    highlightDescription: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    highlightList: this.fb.array<FormControl<string>>([
      this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    ]),
    videoFileName: this.fb.control<string>('', { nonNullable: true }),
    posterFileName: this.fb.control<string>('', { nonNullable: true }),
    featureEyebrow: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    featureTitle: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    featureDescription: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    metrics: this.fb.array<MetricFormGroup>([]),
    partnerLabel: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    partnerDescription: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
  });

  readonly trustForm = this.fb.group({
    tagline: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    logos: this.fb.array<FormControl<string>>([
      this.fb.control<string>('', { nonNullable: true }),
    ]),
    stats: this.fb.array<StatFormGroup>([]),
  });

  readonly testimonialForm = this.fb.group({
    quote: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    name: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    title: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    location: this.fb.control<string>('', { validators: Validators.required, nonNullable: true }),
    rating: this.fb.control<number>(5, { validators: Validators.required, nonNullable: true }),
    type: this.fb.control<HomeTestimonialModel['type']>('client', {
      validators: Validators.required,
      nonNullable: true,
    }),
    imageFileName: this.fb.control<string>('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.load();
  }

  get highlightList(): FormArray<FormControl<string>> {
    return this.heroForm.get('highlightList') as FormArray<FormControl<string>>;
  }

  get metrics(): FormArray<MetricFormGroup> {
    return this.heroForm.get('metrics') as FormArray<MetricFormGroup>;
  }

  get logos(): FormArray<FormControl<string>> {
    return this.trustForm.get('logos') as FormArray<FormControl<string>>;
  }

  get stats(): FormArray<StatFormGroup> {
    return this.trustForm.get('stats') as FormArray<StatFormGroup>;
  }

  addHighlight(value = ''): void {
    this.highlightList.push(
      this.fb.control<string>(value, { validators: Validators.required, nonNullable: true })
    );
  }

  removeHighlight(index: number): void {
    this.highlightList.removeAt(index);
  }

  addMetric(metric?: HomeMetricModel): void {
    this.metrics.push(this.createMetricGroup(metric));
  }

  removeMetric(index: number): void {
    this.metrics.removeAt(index);
  }

  removeLogo(index: number): void {
    this.logos.removeAt(index);
    this.trustLogoFiles.splice(index, 1);
  }

  addStat(stat?: { label: string; value: number; suffix?: string | null; decimals?: number | null }): void {
    this.stats.push(this.createStatGroup(stat));
  }

  removeStat(index: number): void {
    this.stats.removeAt(index);
  }

  onHeroVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.heroVideo = file;
  }

  onHeroPosterSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.heroPoster = file;
  }

  onTestimonialImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.testimonialImage = file;
    if (file) {
      this.testimonialForm.patchValue({ imageFileName: file.name });
    }
  }

  submitHero(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    const request = this.toHeroRequest();
    this.savingHero.set(true);
    this.api.updateHero(request).subscribe({
      next: hero => {
        this.applyHero(hero);
        this.toast.show('Hero section saved', 'success');
        this.savingHero.set(false);
      },
      error: () => {
        this.toast.show('Failed to save hero section', 'error');
        this.savingHero.set(false);
      },
    });
  }

  submitTrust(): void {
    if (this.trustForm.invalid) {
      this.trustForm.markAllAsTouched();
      return;
    }

    const request = this.toTrustRequest();
    this.savingTrust.set(true);
    this.api.updateTrust(request).subscribe({
      next: trust => {
        this.applyTrust(trust);
        this.toast.show('Trust section saved', 'success');
        this.savingTrust.set(false);
      },
      error: () => {
        this.toast.show('Failed to save trust section', 'error');
        this.savingTrust.set(false);
      },
    });
  }

  submitTestimonials(): void {
    if (this.testimonialForm.invalid) {
      this.testimonialForm.markAllAsTouched();
      return;
    }

    this.savingTestimonials.set(true);
    const request = this.toTestimonialRequest();
    const id = this.editingTestimonialId();
    const operation$ = id
      ? this.api.updateTestimonial(id, request)
      : this.api.createTestimonial(request);

    operation$.subscribe({
      next: testimonial => {
        this.toast.show('Testimonial saved', 'success');
        this.savingTestimonials.set(false);
        this.resetTestimonialForm();
        if (id) {
          const updated = this.testimonials().map(item => (item.id === testimonial.id ? testimonial : item));
          this.testimonials.set(updated);
        } else {
          this.testimonials.set([...this.testimonials(), testimonial]);
        }
      },
      error: () => {
        this.toast.show('Failed to save testimonials', 'error');
        this.savingTestimonials.set(false);
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
    this.applyHero(page.hero);
    this.applyTrust(page.trust);
    this.applyTestimonials(page.testimonials);
  }

  private applyHero(hero: HomePageModel['hero']): void {
    this.heroForm.patchValue({
      badge: hero.badge,
      title: hero.title,
      description: hero.description,
      primaryLabel: hero.primaryCta.label,
      primaryLink: hero.primaryCta.routerLink ?? '',
      primaryFragment: hero.primaryCta.fragment ?? '',
      secondaryLabel: hero.secondaryCta.label,
      secondaryLink: hero.secondaryCta.routerLink ?? '',
      secondaryFragment: hero.secondaryCta.fragment ?? '',
      highlightTitle: hero.highlightCard.title,
      highlightDescription: hero.highlightCard.description,
      videoFileName: hero.video?.fileName ?? '',
      posterFileName: hero.poster?.fileName ?? '',
      featureEyebrow: hero.featurePanel.eyebrow,
      featureTitle: hero.featurePanel.title,
      featureDescription: hero.featurePanel.description,
      partnerLabel: hero.featurePanel.partner.label,
      partnerDescription: hero.featurePanel.partner.description,
    });

    this.heroVideo = null;
    this.heroPoster = null;

    this.highlightList.clear();
    hero.highlightList.forEach(item => this.addHighlight(item));

    this.metrics.clear();
    hero.featurePanel.metrics.forEach(metric => this.addMetric(metric));
  }

  private applyTrust(trust: HomePageModel['trust']): void {
    this.trustForm.patchValue({
      tagline: trust.tagline,
    });
    this.logos.clear();
    this.trustLogoFiles = [];
    if (!trust.logos.length) {
      this.addLogo();
    } else {
      trust.logos.forEach(logo => this.addLogo(logo.fileName ?? logo.url ?? ''));
    }

    this.stats.clear();
    trust.stats.forEach(stat => this.addStat(stat));
  }

  private applyTestimonials(testimonials: HomeTestimonialModel[]): void {
    this.testimonials.set(testimonials);
    if (this.editingTestimonialId()) {
      const current = testimonials.find(t => t.id === this.editingTestimonialId());
      if (!current) {
        this.resetTestimonialForm();
      }
    }
  }

  private toHeroRequest(): SaveHomeHeroRequest {
    return {
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
    } satisfies SaveHomeHeroRequest;
  }

  private toTrustRequest(): SaveHomeTrustRequest {
    const logos = this.logos.controls
      .map((control, index) => ({
        fileName: control.value || null,
        url: control.value || null,
        logoFile: this.trustLogoFiles[index],
      }))
      .filter((logo) => !!logo.fileName || !!logo.logoFile);

    return {
      tagline: this.trustForm.value.tagline ?? '',
      logos,
      stats: this.stats.controls.map(control => ({
        label: control.value.label ?? '',
        value: Number(control.value.value ?? 0),
        suffix: control.value.suffix || null,
        decimals: control.value.decimals ?? null,
      })),
    } satisfies SaveHomeTrustRequest;
  }

  editTestimonial(testimonial: HomeTestimonialModel): void {
    this.editingTestimonialId.set(testimonial.id);
    this.testimonialImage = null;
    this.testimonialForm.setValue({
      quote: testimonial.quote,
      name: testimonial.name,
      title: testimonial.title,
      location: testimonial.location,
      rating: testimonial.rating,
      type: testimonial.type as HomeTestimonialModel['type'],
      imageFileName: testimonial.image?.fileName ?? testimonial.image?.url ?? '',
    });
  }

  resetTestimonialForm(): void {
    this.editingTestimonialId.set(null);
    this.testimonialImage = null;
    this.testimonialForm.reset({ rating: 5, type: 'client', imageFileName: '' });
  }

  deleteTestimonial(id: string): void {
    this.savingTestimonials.set(true);
    this.api.deleteTestimonial(id).subscribe({
      next: () => {
        this.toast.show('Testimonial deleted', 'success');
        this.testimonials.set(this.testimonials().filter(t => t.id !== id));
        if (this.editingTestimonialId() === id) {
          this.resetTestimonialForm();
        }
        this.savingTestimonials.set(false);
      },
      error: () => {
        this.toast.show('Failed to delete testimonial', 'error');
        this.savingTestimonials.set(false);
      },
    });
  }

  private toTestimonialRequest(): SaveHomeTestimonialRequest {
    return {
      quote: this.testimonialForm.value.quote ?? '',
      name: this.testimonialForm.value.name ?? '',
      title: this.testimonialForm.value.title ?? '',
      location: this.testimonialForm.value.location ?? '',
      rating: Number(this.testimonialForm.value.rating ?? 5),
      type: this.testimonialForm.value.type ?? 'client',
      imageFileName: this.testimonialForm.value.imageFileName || null,
      imageFile: this.testimonialImage,
    } satisfies SaveHomeTestimonialRequest;
  }

  private createMetricGroup(metric?: HomeMetricModel): MetricFormGroup {
    return this.fb.group({
      label: this.fb.control<string>(metric?.label ?? '', {
        validators: Validators.required,
        nonNullable: true,
      }),
      value: this.fb.control<string>(metric?.value ?? '', {
        validators: Validators.required,
        nonNullable: true,
      }),
      theme: this.fb.control<string>(metric?.theme ?? 'accent', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  private createStatGroup(stat?: {
    label: string;
    value: number;
    suffix?: string | null;
    decimals?: number | null;
  }): StatFormGroup {
    return this.fb.group({
      label: this.fb.control<string>(stat?.label ?? '', {
        validators: Validators.required,
        nonNullable: true,
      }),
      value: this.fb.control<number>(stat?.value ?? 0, {
        validators: Validators.required,
        nonNullable: true,
      }),
      suffix: this.fb.control<string | null>(stat?.suffix ?? ''),
      decimals: this.fb.control<number | null>(stat?.decimals ?? null),
    });
  }

  addLogo(value = ''): void {
    this.logos.push(
      this.fb.control<string>(value, { nonNullable: true })
    );
    this.trustLogoFiles.push(null);
  }

  onTrustLogoSelected(index: number, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.trustLogoFiles[index] = file;
  }
}
