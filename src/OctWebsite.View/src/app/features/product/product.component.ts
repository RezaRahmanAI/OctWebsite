import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductPageApiService, ProductsService } from '../../core/services';
import { CardComponent } from '../../shared/components/card/card.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, CardComponent, RouterLink],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  private readonly productsService = inject(ProductsService);
  private readonly productPageApi = inject(ProductPageApiService);
  readonly query = signal('');

  readonly heroContent = this.productPageApi.content;
  readonly heroEyebrow = computed(() => this.heroContent()?.headerEyebrow || 'Product');
  readonly heroTitle = computed(() => this.heroContent()?.headerTitle || 'ObjectCanvas industry solutions');
  readonly heroSubtitle = computed(
    () =>
      this.heroContent()?.headerSubtitle ||
      'Configured platforms ready to deploy for your vertical.',
  );
  readonly heroVideoUrl = computed(() => this.heroContent()?.heroVideo?.url || '/video/project/project.mp4');

  readonly products = computed(() => {
    const term = this.query().toLowerCase();
    const items = this.productsService.products();
    if (!term) {
      return items;
    }
    return items.filter(product => product.title.toLowerCase().includes(term) || product.summary.toLowerCase().includes(term));
  });

  constructor() {
    void this.productsService.ensureLoaded();
    this.productPageApi.load();
  }
}
