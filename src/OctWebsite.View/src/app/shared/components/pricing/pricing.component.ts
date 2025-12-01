import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class PricingComponent {
  private readonly contentService = inject(ContentService);

  readonly plans = signal<PricingPlanItem[]>([]);

  constructor() {
    this.contentService
      .getPricingPlans()
      .pipe(takeUntilDestroyed())
      .subscribe((plans) => {
        this.plans.set(plans);
      });
  }

  trackById(_: number, plan: PricingPlanItem): string {
    return plan.id;
  }
}
