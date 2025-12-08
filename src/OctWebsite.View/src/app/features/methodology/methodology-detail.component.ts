import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectionHeadingComponent, SectionHeadingCta } from '../../shared/components/section-heading/section-heading.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import {
  MethodologyOfferingModel,
  MethodologyPageApiService,
} from '../../core/services/methodology-page-api.service';

@Component({
  selector: 'app-methodology-detail',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, SectionHeaderComponent, SectionHeadingComponent],
  templateUrl: './methodology-detail.component.html',
  styleUrls: ['./methodology.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodologyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(MethodologyPageApiService);

  readonly offering = signal<MethodologyOfferingModel | null>(null);

  readonly otherOfferings = computed(() =>
    this.api
      .offerings()
      .filter((item) => item.slug !== this.offering()?.slug && item.active)
  );

  readonly heroCtas: SectionHeadingCta[] = [
    {
      label: 'Talk to our team →',
      routerLink: '/contact',
    },
    {
      label: 'Back to overview',
      routerLink: '/methodology',
      variant: 'secondary',
    },
  ];

  ngOnInit(): void {
    this.api.fetchOfferings().subscribe();

    this.route.paramMap.subscribe(params => {
      const slug = params.get('id');
      if (!slug) {
        this.router.navigate(['/methodology']);
        return;
      }

      this.api.fetchOffering(slug).subscribe({
        next: offering => this.offering.set(offering),
        error: () => this.router.navigate(['/methodology']),
      });
    });
  }
}
