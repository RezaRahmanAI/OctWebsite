import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeContent } from '../../../../core/models/home-content.model';
import { getGsap, getScrollTrigger } from '../../../../shared/animations/gsap-helpers';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, AssetUrlPipe],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) hero!: HomeContent['hero'];
  @Input() videoSrc = '/video/hero.mp4';
  @Input() videoPoster = '';

  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('heroSection') heroSection?: ElementRef<HTMLElement>;
  @ViewChild('heroOverlay') heroOverlay?: ElementRef<HTMLElement>;
  @ViewChild('heroDescription') heroDescription?: ElementRef<HTMLParagraphElement>;
  @ViewChild('heroBadge') heroBadge?: ElementRef<HTMLSpanElement>;
  @ViewChild('mediaCard') mediaCard?: ElementRef<HTMLDivElement>;
  @ViewChild('mediaImage') mediaImage?: ElementRef<HTMLImageElement>;
  @ViewChildren('titleWord') titleWordElements?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('ctaButton') ctaButtons?: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChildren('highlightItem') highlightItems?: QueryList<ElementRef<HTMLLIElement>>;
  @ViewChildren('floatingCard') floatingCards?: QueryList<ElementRef<HTMLDivElement>>;

  private timeline?: any;
  private parallaxTween?: any;

  protected get displayTitleWords(): string[] {
    return (this.hero?.title ?? '').split(' ').filter((word) => word.length > 0);
  }

  ngAfterViewInit(): void {
    const gsap = getGsap();
    if (!gsap) {
      console.warn('GSAP is not available for hero animations.');
      return;
    }

    const ScrollTrigger = getScrollTrigger();
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    // Ensure muted before trying to play (for autoplay policies)
    video.muted = true;

    const attemptPlay = () => {
      if (!video.isConnected) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err?.name !== 'AbortError') {
            console.warn('Autoplay was blocked:', err);
          }
        });
      }
    };

    if (video.readyState >= 2) {
      attemptPlay();
    } else {
      video.addEventListener('loadeddata', attemptPlay, { once: true });
    }

    this.timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (this.heroOverlay) {
      this.timeline.from(this.heroOverlay.nativeElement, { opacity: 0, duration: 0.8 });
    }

    if (this.heroBadge) {
      this.timeline.from(this.heroBadge.nativeElement, { y: -12, opacity: 0, duration: 0.6 }, '-=0.2');
    }

    const titleWordEls = this.titleWordElements?.toArray().map((ref) => ref.nativeElement) ?? [];
    const ctaEls = this.ctaButtons?.toArray().map((ref) => ref.nativeElement) ?? [];
    const highlightEls = this.highlightItems?.toArray().map((ref) => ref.nativeElement) ?? [];
    const floatingEls = this.floatingCards?.toArray().map((ref) => ref.nativeElement) ?? [];

    if (titleWordEls.length) {
      this.timeline.from(titleWordEls, { y: 36, opacity: 0, stagger: 0.06, duration: 0.9 }, '-=0.1');
    }

    if (this.heroDescription) {
      this.timeline.from(this.heroDescription.nativeElement, { y: 24, opacity: 0, duration: 0.7 }, '-=0.3');
    }

    if (ctaEls.length) {
      this.timeline.from(ctaEls, { y: 20, opacity: 0, stagger: 0.08, duration: 0.6 }, '-=0.25');
    }

    if (highlightEls.length) {
      this.timeline.from(highlightEls, { y: 18, opacity: 0, stagger: 0.05, duration: 0.6 }, '-=0.35');
    }

    if (this.mediaCard) {
      this.timeline.from(this.mediaCard.nativeElement, { y: 48, opacity: 0, duration: 1 }, '-=0.4');
    }

    if (floatingEls.length) {
      this.timeline.from(floatingEls, { y: 26, opacity: 0, stagger: 0.12, duration: 0.8 }, '-=0.5');
    }

    if (this.heroSection?.nativeElement && this.mediaImage?.nativeElement && ScrollTrigger) {
      this.parallaxTween = gsap.to(this.mediaImage.nativeElement, {
        y: -40,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: this.heroSection.nativeElement,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.timeline?.kill?.();
    this.parallaxTween?.scrollTrigger?.kill?.();
    this.parallaxTween?.kill?.();
  }
}
