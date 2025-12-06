import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductShowcaseService } from '../../core/services';
import { ProductShowcaseItem } from '../../core/models';

@Component({
  selector: 'app-product-showcase-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-showcase-detail.component.html',
  styleUrls: ['./product-showcase-detail.component.css'],
})
export class ProductShowcaseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly showcaseService = inject(ProductShowcaseService);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map(params => params.get('slug') ?? '')),
    { initialValue: '' },
  );

  readonly loading = signal(true);
  readonly product = signal<ProductShowcaseItem | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    const slug = this.slug();
    if (!slug) {
      this.loading.set(false);
      return;
    }

    await this.showcaseService.ensureLoaded();
    const found = await this.showcaseService.getBySlug(slug);
    this.product.set(found);
    this.loading.set(false);
  }
}
