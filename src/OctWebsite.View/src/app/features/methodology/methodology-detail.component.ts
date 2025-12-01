import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { contactFields, offerings, type MatrixKey, type Offering } from './methodology.data';

@Component({
  selector: 'app-methodology-detail',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, SectionHeaderComponent],
  templateUrl: './methodology-detail.component.html',
  styleUrls: ['./methodology.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodologyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly contactFields = contactFields;
  readonly allOfferings: Offering[] = offerings;

  readonly offering = signal<Offering | null>(null);

  readonly otherOfferings = computed(() =>
    this.allOfferings.filter((item) => item.id !== this.offering()?.id)
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') as MatrixKey | null;
      const match = this.allOfferings.find((item) => item.id === id) ?? null;
      if (!match) {
        this.router.navigate(['/methodology']);
        return;
      }
      this.offering.set(match);
    });
  }
}
