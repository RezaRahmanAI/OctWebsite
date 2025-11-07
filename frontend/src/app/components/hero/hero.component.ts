import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { SiteSettings } from '../../models/site-settings.model';
import { AboutSection } from '../../models/about-section.model';
import gsap from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgIf],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('heroRef', { static: true })
  private heroRef!: ElementRef<HTMLElement>;

  private readonly gsapContext = signal<gsap.Context | null>(null);

  readonly settings = signal<SiteSettings | null>(null);
  readonly aboutSections = signal<AboutSection[]>([]);

  constructor() {
    this.api
      .getSiteSettings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((settings) => this.settings.set(settings));

    this.api
      .getAboutSections()
      .pipe(
        map((sections) =>
          sections.map((section) => ({ ...section, key: section.key.toLowerCase() }))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((sections) => this.aboutSections.set(sections));
  }

  get mission(): AboutSection | undefined {
    return this.aboutSections().find((section) => section.key === 'mission');
  }

  get vision(): AboutSection | undefined {
    return this.aboutSections().find((section) => section.key === 'vision');
  }

  ngAfterViewInit(): void {
    const context = gsap.context(() => {
      gsap.from('[data-hero-animate="headline"]', {
        y: 32,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      gsap.from('[data-hero-animate="copy"]', {
        y: 48,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.1
      });
      gsap.from('[data-hero-animate="cta"]', {
        y: 24,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
      });
    }, this.heroRef.nativeElement);

    this.gsapContext.set(context);
  }

  ngOnDestroy(): void {
    this.gsapContext()?.revert();
  }
}
