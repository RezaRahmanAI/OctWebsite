import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
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
export class HomeHeroComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input({ required: true }) hero!: HomeContent['hero'];

  /**
   * Optional override from parent.
   * If hero.video.src is set from API, that will be used first.
   */
  @Input() videoSrc: string = '/video/hero.mp4';
  @Input() videoPoster: string = '';

  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('heroSection') heroSection?: ElementRef<HTMLElement>;
  @ViewChild('heroOverlay') heroOverlay?: ElementRef<HTMLElement>;
  @ViewChild('heroDescription') heroDescription?: ElementRef<HTMLParagraphElement>;
  @ViewChild('heroBadge') heroBadge?: ElementRef<HTMLSpanElement>;
  @ViewChild('mediaCard') mediaCard?: ElementRef<HTMLDivElement>;
  @ViewChild('mediaImage') mediaImage?: ElementRef<HTMLImageElement>;
  @ViewChildren('titleWord') titleWordElements?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('ctaButton') ctaButtons?: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChildren('floatingCard') floatingCards?: QueryList<ElementRef<HTMLDivElement>>;

  private timeline?: any;
  private parallaxTween?: any;

  protected get displayTitleWords(): string[] {
    return (this.hero?.title ?? '').split(' ').filter((word) => word.length > 0);
  }

  /** Effective values that the template + video setup will use */
  private get effectiveVideoSrc(): string {
    return (this.hero?.video?.src || this.videoSrc || '').trim();
  }

  private get effectivePoster(): string {
    return (this.hero?.video?.poster || this.videoPoster || '').trim();
  }

  // ---------------- Lifecycle ----------------

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

    // ✅ First attempt to initialize and autoplay the video
    this.setupVideoPlayback();

    // -------------- Animations --------------

    this.timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (this.heroOverlay) {
      this.timeline.from(this.heroOverlay.nativeElement, { opacity: 0, duration: 0.8 });
    }

    if (this.heroBadge) {
      this.timeline.from(
        this.heroBadge.nativeElement,
        { y: -12, opacity: 0, duration: 0.6 },
        '-=0.2'
      );
    }

    const titleWordEls = this.titleWordElements?.toArray().map((ref) => ref.nativeElement) ?? [];
    const ctaEls = this.ctaButtons?.toArray().map((ref) => ref.nativeElement) ?? [];
    const floatingEls = this.floatingCards?.toArray().map((ref) => ref.nativeElement) ?? [];

    if (titleWordEls.length) {
      this.timeline.from(
        titleWordEls,
        { y: 36, opacity: 0, stagger: 0.06, duration: 0.9 },
        '-=0.1'
      );
    }

    if (this.heroDescription) {
      this.timeline.from(
        this.heroDescription.nativeElement,
        { y: 24, opacity: 0, duration: 0.7 },
        '-=0.3'
      );
    }

    if (ctaEls.length) {
      this.timeline.from(ctaEls, { y: 20, opacity: 0, stagger: 0.08, duration: 0.6 }, '-=0.25');
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

  /**
   * 🔁 This is the key fix.
   * When hero or videoSrc input changes (e.g. after API response),
   * we re-run the video setup so autoplay works on first normal load.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hero'] || changes['videoSrc'] || changes['videoPoster']) {
      this.setupVideoPlayback();
    }
  }

  ngOnDestroy(): void {
    this.timeline?.kill?.();
    this.parallaxTween?.scrollTrigger?.kill?.();
    this.parallaxTween?.kill?.();
  }

  // ---------------- Helpers ----------------

  private setupVideoPlayback(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) {
      // View might not be initialized yet; ngAfterViewInit will try again.
      return;
    }

    const src = this.effectiveVideoSrc;
    if (!src) {
      // No valid src yet – nothing to load/play
      return;
    }

    // Ensure muted for autoplay policies
    video.muted = true;

    // Force browser to reload the source if it changed
    // (the [src] binding in the template updates the <source> src attribute)
    video.load();

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
  }
}
