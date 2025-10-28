import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services';
import { CardComponent, SectionHeadingComponent } from '../../shared/components';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, CardComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  private readonly productsService = inject(ProductsService);
  readonly query = signal('');

  readonly products = computed(() => {
    const term = this.query().toLowerCase();
    const items = this.productsService.products();
    if (!term) {
      return items;
    }
    return items.filter(product => product.title.toLowerCase().includes(term) || product.summary.toLowerCase().includes(term));
  });
}
