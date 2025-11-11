import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import type { StatItem, Testimonial } from '../../core/models/home-content.model';
import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { RouterLink } from '@angular/router';
import { TechStackComponent } from "./tech-stack-slider/tech-stack-slider.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, TechStackComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly seo = inject(SeoService);
  private readonly content = inject(ContentService);

  protected readonly home = this.content.homeContent;
  protected readonly heroVideoSrc = computed(() => this.normalizeMediaUrl(this.home().hero.video.src));
  protected readonly heroVideoPoster = computed(() => this.normalizeMediaUrl(this.home().hero.video.poster));

  protected readonly testimonialView = signal<'client' | 'student'>('client');

  protected readonly filteredTestimonials = computed(() => {
    const view = this.testimonialView();
    return this.home().testimonials.items.filter(
      (testimonial: Testimonial) => testimonial.type === view
    );
  });

  protected readonly statsPool = computed(() => [
    ...this.home().trust.stats,
    ...this.home().academy.stats,
    ...this.home().impact.stats
  ]);

  constructor() {
    this.seo.update({
      title: 'ObjectCanvas × ZeroProgrammingBD | Software Solutions & Tech Academy',
      description:
        'ObjectCanvas Studios and ZeroProgrammingBD Academy deliver enterprise software, digital marketing, and live technology education for founders, enterprises, and future makers.',
      keywords:
        'objectcanvas, zeroprogrammingbd, software development Bangladesh, digital marketing, tech academy, angular tailwind',
      canonical: 'https://www.objectcanvas.com'
    });
  }

  protected setTestimonialView(view: 'client' | 'student'): void {
    this.testimonialView.set(view);
  }

  protected formatStatValue(stat: StatItem): string {
    const decimals = stat.decimals ?? 0;
    const formatted = Number(stat.value).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return `${formatted}${stat.suffix ?? ''}`;
  }

  private normalizeMediaUrl(url: string | null | undefined): string {
    if (!url) {
      return '';
    }
    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
      return url;
    }
    const normalized = url.startsWith('/') ? url : `/${url.replace(/^\/+/, '')}`;
    return normalized.replace(/\/+$/, '');
  }
}
