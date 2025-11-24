import { Component, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { SectionHeaderComponent } from "../../../../shared/components/section-header/section-header.component";
import { ProductShowcaseService } from './product-showcase.service';
import type { ProductShowcaseItem } from './product-showcase.service';

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  templateUrl: './product-showcase.html',
  styleUrls: ['./product-showcase.css'],
  imports: [NgFor, NgClass, SectionHeaderComponent],
})
export class ProductShowcaseComponent {
  private readonly showcaseService = inject(ProductShowcaseService);

  public sectionName = 'Product Showcase';
  public sectionTitle = 'Our Custom Software Development Products';
  public sectionSubtitle =
    'We build robust, scalable, and efficient software products tailored to your business.';

  get products(): ProductShowcaseItem[] {
    return this.showcaseService.products();
  }

  // Duplicate products so the marquee can loop seamlessly
  get marqueeProducts(): ProductShowcaseItem[] {
    return [...this.products, ...this.products];
  }
}
