import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal
} from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ScrollToDirective } from '../../shared/directives/scroll-reveal.directive';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { ContentService } from '../../core/services/content.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ScrollToDirective, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit {
  private readonly seo = inject(SeoService);
  private readonly animation = inject(AnimationService);
  private readonly content = inject(ContentService);

  @ViewChildren('counter', { read: ElementRef })
  private counters?: QueryList<ElementRef<HTMLElement>>;

  protected readonly home = this.content.homeContent;
  protected readonly heroVideoSrc = computed(() => this.normalizeMediaUrl(this.home().hero.video.src));
  protected readonly heroVideoPoster = computed(() => this.normalizeMediaUrl(this.home().hero.video.poster));

  protected readonly testimonialView = signal<'client' | 'student'>('client');

  protected readonly filteredTestimonials = computed(() =>
    this.home().testimonials.items.filter((testimonial) => testimonial.type === this.testimonialView())
  );

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
        'objectcanvas, zeroprogrammingbd, software development Bangladesh, digital marketing, tech academy, angular tailwind lenis',
      canonical: 'https://www.objectcanvas.com'
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      const stats = this.statsPool();
      this.counters?.forEach((counter, index) => {
        const stat = stats[index];
        if (!stat) {
          return;
        }
        counter.nativeElement.setAttribute('data-suffix', stat.suffix ?? '');
        if (stat.decimals != null) {
          counter.nativeElement.setAttribute('data-decimals', String(stat.decimals));
        }
        this.animation.animateCounter(counter.nativeElement, stat.value);
      });
    });
  }

  protected setTestimonialView(view: 'client' | 'student'): void {
    this.testimonialView.set(view);
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
