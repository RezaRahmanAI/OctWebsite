import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BenefitCardModel,
  MethodologyOfferingModel,
  MethodologyPageApiService,
  ProcessStepModel,
  SaveMethodologyOfferingRequest,
  StatHighlightModel,
} from '../../core/services/methodology-page-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-methodology-offerings-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './methodology-offerings-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MethodologyOfferingsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(MethodologyPageApiService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly offerings = this.api.offerings;
  readonly selectedId = signal<string | null>(null);

  readonly form = this.fb.group({
    slug: ['', Validators.required],
    badge: ['', Validators.required],
    headline: ['', Validators.required],
    subheadline: ['', Validators.required],
    intro: this.fb.array([]),
    stats: this.fb.array([]),
    benefits: this.fb.array([]),
    process: this.fb.array([]),
    closingTitle: ['', Validators.required],
    closingBullets: this.fb.array([]),
    closingCtaLabel: ['', Validators.required],
    active: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  get intro(): FormArray {
    return this.form.get('intro') as FormArray;
  }

  get stats(): FormArray {
    return this.form.get('stats') as FormArray;
  }

  get benefits(): FormArray {
    return this.form.get('benefits') as FormArray;
  }

  get process(): FormArray {
    return this.form.get('process') as FormArray;
  }

  get closingBullets(): FormArray {
    return this.form.get('closingBullets') as FormArray;
  }

  addIntro(value = ''): void {
    this.intro.push(this.fb.control(value, Validators.required));
  }

  removeIntro(index: number): void {
    this.intro.removeAt(index);
  }

  addStat(stat?: StatHighlightModel): void {
    this.stats.push(
      this.fb.group({
        label: [stat?.label ?? '', Validators.required],
        value: [stat?.value ?? '', Validators.required],
      })
    );
  }

  removeStat(index: number): void {
    this.stats.removeAt(index);
  }

  addBenefit(benefit?: BenefitCardModel): void {
    this.benefits.push(
      this.fb.group({
        title: [benefit?.title ?? '', Validators.required],
        description: [benefit?.description ?? '', Validators.required],
      })
    );
  }

  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }

  addProcess(step?: ProcessStepModel): void {
    this.process.push(
      this.fb.group({
        title: [step?.title ?? '', Validators.required],
        description: [step?.description ?? '', Validators.required],
      })
    );
  }

  removeProcess(index: number): void {
    this.process.removeAt(index);
  }

  addClosingBullet(value = ''): void {
    this.closingBullets.push(this.fb.control(value, Validators.required));
  }

  removeClosingBullet(index: number): void {
    this.closingBullets.removeAt(index);
  }

  editOffering(offering: MethodologyOfferingModel): void {
    this.selectedId.set(offering.id);
    this.apply(offering);
  }

  resetForm(): void {
    this.selectedId.set(null);
    this.form.reset({ active: true });
    this.intro.clear();
    this.stats.clear();
    this.benefits.clear();
    this.process.clear();
    this.closingBullets.clear();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.toRequest();
    this.loading.set(true);

    const action$ = this.selectedId()
      ? this.api.updateOffering(this.selectedId()!, request)
      : this.api.createOffering(request);

    action$.subscribe({
      next: offering => {
        this.toast.show('Methodology offering saved', 'success');
        this.loading.set(false);
        this.editOffering(offering);
      },
      error: () => {
        this.toast.show('Unable to save offering', 'error');
        this.loading.set(false);
      },
    });
  }

  deleteOffering(offering: MethodologyOfferingModel): void {
    this.loading.set(true);
    this.api.deleteOffering(offering.id).subscribe({
      next: () => {
        this.toast.show('Offering deleted', 'success');
        this.loading.set(false);
        this.resetForm();
      },
      error: () => {
        this.toast.show('Unable to delete offering', 'error');
        this.loading.set(false);
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.fetchOfferings().subscribe({
      next: offerings => {
        if (offerings.length > 0) {
          this.editOffering(offerings[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load methodology offerings', 'error');
        this.loading.set(false);
      },
    });
  }

  private apply(offering: MethodologyOfferingModel): void {
    this.form.patchValue({
      slug: offering.slug,
      badge: offering.badge,
      headline: offering.headline,
      subheadline: offering.subheadline,
      closingTitle: offering.closing.title,
      closingCtaLabel: offering.closing.ctaLabel,
      active: offering.active,
    });

    this.intro.clear();
    offering.intro.forEach(text => this.addIntro(text));

    this.stats.clear();
    offering.stats.forEach(stat => this.addStat(stat));

    this.benefits.clear();
    offering.benefits.forEach(benefit => this.addBenefit(benefit));

    this.process.clear();
    offering.process.forEach(step => this.addProcess(step));

    this.closingBullets.clear();
    offering.closing.bullets.forEach(bullet => this.addClosingBullet(bullet));
  }

  private toRequest(): SaveMethodologyOfferingRequest {
    const raw = this.form.value;
    return {
      slug: raw.slug ?? '',
      badge: raw.badge ?? '',
      headline: raw.headline ?? '',
      subheadline: raw.subheadline ?? '',
      intro: this.intro.controls.map(control => control.value ?? ''),
      stats: this.stats.controls.map(control => ({
        label: control.value.label ?? '',
        value: control.value.value ?? '',
      })),
      benefits: this.benefits.controls.map(control => ({
        title: control.value.title ?? '',
        description: control.value.description ?? '',
      })),
      process: this.process.controls.map(control => ({
        title: control.value.title ?? '',
        description: control.value.description ?? '',
      })),
      closing: {
        title: raw.closingTitle ?? '',
        bullets: this.closingBullets.controls.map(control => control.value ?? ''),
        ctaLabel: raw.closingCtaLabel ?? '',
      },
      active: raw.active ?? false,
    } satisfies SaveMethodologyOfferingRequest;
  }
}
