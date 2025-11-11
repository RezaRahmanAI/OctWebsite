import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentService } from '../../../core/services/content.service';
import { PricingPlanItem } from '../../../core/models/pricing-plan.model';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
})
export class PricingComponent implements AfterViewInit {
  private readonly contentService = inject(ContentService);
  @ViewChildren('pricingCard', { read: ElementRef })
  private readonly pricingCards!: QueryList<ElementRef<HTMLElement>>;

  readonly plans = signal<PricingPlanItem[]>([]);

  constructor() {
    this.contentService
      .getPricingPlans()
      .pipe(takeUntilDestroyed())
      .subscribe((plans) => {
        this.plans.set(plans);
        queueMicrotask(() => this.animateCards());
      });
  }

  ngAfterViewInit(): void {
    this.animateCards();
  }

  trackById(_: number, plan: PricingPlanItem): string {
    return plan.id;
  }

  private animateCards(): void {
    const cards = this.pricingCards?.toArray() ?? [];
    cards.forEach((card, index) => {
      gsap.from(card.nativeElement, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power3.out',
      });
    });
  }
}
