import { Component, inject, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ProductShowcaseService } from '../../../../core/services/product-showcase.service';
import type { ProductShowcaseItem } from '../../../../core/services/product-showcase.service';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

const CARD_WIDTH = 360;
const CARD_GAP = 48;
const SLIDE_DISTANCE = CARD_WIDTH + CARD_GAP;

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  templateUrl: './product-showcase.html',
  styleUrls: ['./product-showcase.css'],
  imports: [NgFor, NgClass, SectionHeaderComponent, ScrollRevealDirective],
})
export class ProductShowcaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardTrack') cardTrack!: ElementRef<HTMLDivElement>;

  private readonly showcaseService = inject(ProductShowcaseService);

  // Section texts
  public sectionName = 'Product Showcase';
  public sectionTitle = 'Our Custom Software Development Products';
  public sectionSubtitle =
    'We build robust, scalable, and efficient software products tailored to your business.';

  // Data
  public products: ProductShowcaseItem[] = this.showcaseService.products();

  // Duplicate products so the carousel can loop seamlessly
  public marqueeProducts: ProductShowcaseItem[] = [...this.products, ...this.products];

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
    track.style.transform = 'translateX(0)';
    track.style.transition = 'none';

    this.scheduleNextSlide();
  }

  ngOnDestroy(): void {
    if (this.carouselTimeoutId) {
      clearTimeout(this.carouselTimeoutId);
    }
  }

  /** Slide by one card: leftmost moves out of view, new one enters from right */
  private slideOnce(): void {
    const track = this.cardTrack?.nativeElement;
    if (!track) return;

    const baseLength = this.products.length;
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
