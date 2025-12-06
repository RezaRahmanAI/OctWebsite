import { Component, inject, AfterViewInit, OnDestroy, OnInit, ViewChild, ElementRef, computed, effect } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ProductShowcaseItem } from '../../../../core/models';
import { ProductShowcaseService } from '../../../../core/services/product-showcase.service';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

const CARD_WIDTH = 360;
const CARD_GAP = 48;
const SLIDE_DISTANCE = CARD_WIDTH + CARD_GAP;

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  templateUrl: './product-showcase.html',
  styleUrls: ['./product-showcase.css'],
  imports: [NgFor, NgClass, RouterModule, SectionHeaderComponent, ScrollRevealDirective],
})
export class ProductShowcaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardTrack') cardTrack!: ElementRef<HTMLDivElement>;

  private readonly showcaseService = inject(ProductShowcaseService);

  // Section texts
  public sectionName = 'Product Showcase';
  public sectionTitle = 'Our Custom Software Development Products';
  public sectionSubtitle =
    'We build robust, scalable, and efficient software products tailored to your business.';

  // Data
  public readonly products = this.showcaseService.products;

  // Duplicate products so the carousel can loop seamlessly
  public readonly marqueeProducts = computed<ProductShowcaseItem[]>(() => {
    const items = this.products();
    return [...items, ...items];
  });

  // Animation config
  private carouselTimeoutId: any;
  private readonly animationDuration = 600; // ms for slide animation
  private readonly minPause = 1000; // 1s
  private readonly maxPause = 3000; // 3s
  private currentIndex = 0;

  ngAfterViewInit(): void {
    const track = this.cardTrack?.nativeElement;
    if (!track) return;

    // Initial state
    this.resetTrackPosition(track);

    this.scheduleNextSlide();

    effect(() => {
      const items = this.marqueeProducts();
      if (!items.length || !this.cardTrack?.nativeElement) {
        return;
      }

      this.currentIndex = 0;
      this.resetTrackPosition(this.cardTrack.nativeElement);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.showcaseService.ensureLoaded();
  }

  ngOnDestroy(): void {
    if (this.carouselTimeoutId) {
      clearTimeout(this.carouselTimeoutId);
    }
  }

  private resetTrackPosition(track: HTMLDivElement): void {
    track.style.transform = 'translateX(0)';
    track.style.transition = 'none';
  }

  /** Slide by one card: leftmost moves out of view, new one enters from right */
  private slideOnce(): void {
    const track = this.cardTrack?.nativeElement;
    if (!track) return;

    const baseLength = this.products().length;
    if (baseLength === 0) return;

    // Move to next card
    this.currentIndex += 1;

    // Animate the track
    track.style.transition = `transform ${this.animationDuration}ms ease-in-out`;
    track.style.transform = `translateX(-${this.currentIndex * SLIDE_DISTANCE}px)`;

    // After animation: if we've gone past the first copy, jump back by baseLength
    setTimeout(() => {
      if (this.currentIndex >= baseLength) {
        this.currentIndex = this.currentIndex - baseLength;

        // Jump back with no animation -> visually seamless because list is duplicated
        track.style.transition = 'none';
        track.style.transform = `translateX(-${this.currentIndex * SLIDE_DISTANCE}px)`;
      }
    }, this.animationDuration);
  }

  /** Schedule continuous sliding with 1–3s pause between slides */
  private scheduleNextSlide(): void {
    const pause = this.minPause + Math.random() * (this.maxPause - this.maxPause);

    // Actually we want: min + random * (max - min)
    const fixedPause = this.minPause + Math.random() * (this.maxPause - this.minPause);

    this.carouselTimeoutId = setTimeout(() => {
      this.slideOnce();
      this.scheduleNextSlide(); // loop forever
    }, fixedPause + this.animationDuration);
  }
}
