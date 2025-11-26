import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { HomeContent } from '../../core/models';
import { ToastService } from '../../core/services';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class HomeAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly content = inject(ContentService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    heroBadge: ['', Validators.required],
    heroTitle: ['', Validators.required],
    heroDescription: ['', Validators.required],
    primaryLabel: ['', Validators.required],
    primaryLink: ['', Validators.required],
    secondaryLabel: [''],
    secondaryLink: [''],
    trustTagline: ['', Validators.required],
    trustCompanies: ['', Validators.required],
    testimonialQuote: ['', Validators.required],
    testimonialName: ['', Validators.required],
    testimonialTitle: ['', Validators.required],
    closingBusinessTitle: ['', Validators.required],
    closingBusinessDescription: ['', Validators.required],
    closingBusinessLabel: ['', Validators.required],
    closingBusinessLink: ['', Validators.required],
    closingAcademyTitle: ['', Validators.required],
    closingAcademyDescription: ['', Validators.required],
    closingAcademyLabel: ['', Validators.required],
    closingAcademyLink: ['', Validators.required],
  });

  ngOnInit(): void {
    this.content.fetchHomeFromApi();
    this.applyContent(this.content.homeContent());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const current = this.content.homeContent();
    const companies = (this.form.value.trustCompanies ?? '')
      .split(/,|\n/)
      .map(value => value.trim())
      .filter(Boolean);

    const updated: HomeContent = {
      ...current,
      hero: {
        ...current.hero,
        badge: this.form.value.heroBadge ?? current.hero.badge,
        title: this.form.value.heroTitle ?? current.hero.title,
        description: this.form.value.heroDescription ?? current.hero.description,
        primaryCta: {
          ...current.hero.primaryCta,
          label: this.form.value.primaryLabel ?? current.hero.primaryCta.label,
          routerLink: this.form.value.primaryLink ?? current.hero.primaryCta.routerLink,
          externalUrl: this.form.value.primaryLink ?? current.hero.primaryCta.externalUrl,
        },
        secondaryCta: {
          ...current.hero.secondaryCta,
          label: this.form.value.secondaryLabel ?? current.hero.secondaryCta.label,
          routerLink: this.form.value.secondaryLink ?? current.hero.secondaryCta.routerLink,
          externalUrl: this.form.value.secondaryLink ?? current.hero.secondaryCta.externalUrl,
        },
      },
      trust: {
        ...current.trust,
        tagline: this.form.value.trustTagline ?? current.trust.tagline,
        companies,
      },
      testimonials: {
        ...current.testimonials,
        items: [
          {
            ...current.testimonials.items[0],
            quote: this.form.value.testimonialQuote ?? current.testimonials.items[0]?.quote ?? '',
            name: this.form.value.testimonialName ?? current.testimonials.items[0]?.name ?? '',
            title: this.form.value.testimonialTitle ?? current.testimonials.items[0]?.title ?? '',
          },
          ...current.testimonials.items.slice(1),
        ],
      },
      closingCtas: {
        business: {
          ...current.closingCtas.business,
          title: this.form.value.closingBusinessTitle ?? current.closingCtas.business.title,
          description: this.form.value.closingBusinessDescription ?? current.closingCtas.business.description,
          cta: {
            ...current.closingCtas.business.cta,
            label: this.form.value.closingBusinessLabel ?? current.closingCtas.business.cta.label,
            routerLink: this.form.value.closingBusinessLink ?? current.closingCtas.business.cta.routerLink,
            externalUrl: this.form.value.closingBusinessLink ?? current.closingCtas.business.cta.externalUrl,
          },
        },
        academy: {
          ...current.closingCtas.academy,
          title: this.form.value.closingAcademyTitle ?? current.closingCtas.academy.title,
          description: this.form.value.closingAcademyDescription ?? current.closingCtas.academy.description,
          cta: {
            ...current.closingCtas.academy.cta,
            label: this.form.value.closingAcademyLabel ?? current.closingCtas.academy.cta.label,
            routerLink: this.form.value.closingAcademyLink ?? current.closingCtas.academy.cta.routerLink,
            externalUrl: this.form.value.closingAcademyLink ?? current.closingCtas.academy.cta.externalUrl,
          },
        },
      },
    };

    this.loading.set(true);
    this.content.saveHomeContent(updated).subscribe({
      next: content => {
        this.applyContent(content);
        this.toast.show('Home page saved', 'success');
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to save home page', 'error');
        this.loading.set(false);
      },
    });
  }

  applyContent(content: HomeContent): void {
    const firstTestimonial = content.testimonials.items[0];
    this.form.patchValue({
      heroBadge: content.hero.badge,
      heroTitle: content.hero.title,
      heroDescription: content.hero.description,
      primaryLabel: content.hero.primaryCta.label,
      primaryLink: (content.hero.primaryCta.routerLink as string) ?? content.hero.primaryCta.externalUrl ?? '',
      secondaryLabel: content.hero.secondaryCta.label,
      secondaryLink: (content.hero.secondaryCta.routerLink as string) ?? content.hero.secondaryCta.externalUrl ?? '',
      trustTagline: content.trust.tagline,
      trustCompanies: content.trust.companies.join(', '),
      testimonialQuote: firstTestimonial?.quote ?? '',
      testimonialName: firstTestimonial?.name ?? '',
      testimonialTitle: firstTestimonial?.title ?? '',
      closingBusinessTitle: content.closingCtas.business.title,
      closingBusinessDescription: content.closingCtas.business.description,
      closingBusinessLabel: content.closingCtas.business.cta.label,
      closingBusinessLink: (content.closingCtas.business.cta.routerLink as string) ?? content.closingCtas.business.cta.externalUrl ?? '',
      closingAcademyTitle: content.closingCtas.academy.title,
      closingAcademyDescription: content.closingCtas.academy.description,
      closingAcademyLabel: content.closingCtas.academy.cta.label,
      closingAcademyLink: (content.closingCtas.academy.cta.routerLink as string) ?? content.closingCtas.academy.cta.externalUrl ?? '',
    });
  }
}
