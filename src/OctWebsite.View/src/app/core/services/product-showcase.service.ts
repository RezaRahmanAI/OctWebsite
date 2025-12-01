import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface ProductShowcaseItem {
  name: string;
  description: string;
  imageUrl: string;
  backgroundColor: string; // Tailwind background classes
  projectScreenshotUrl: string; // Image shown in the card
}

const STATIC_SHOWCASE_PRODUCTS: ProductShowcaseItem[] = [
  {
    name: 'DMS',
    description:
      'DMS is a smart Distribution Business Management System that provides accounting, purchase, sales, SR control, and stock management via mobile app or website so you can fully control your products.',
    imageUrl: '/images/project/dms.jpg',
    backgroundColor: 'bg-[#06ac30]', // soft mint
    projectScreenshotUrl: '/images/project/dms.jpg',
  },
  {
    name: 'Ebike',
    description:
      'Ebike is software for motorcycle showrooms, covering account settlement, stock, sales, purchases, and registration document preparation—an essential part of your showroom management.',
    imageUrl: '/images/project/ebike.jpg',
    backgroundColor: 'bg-[#8b0101]', // soft blue
    projectScreenshotUrl: '/images/project/ebike.jpg',
  },
  {
    name: 'Ezone',
    description:
      'A software for electronics showrooms that gives you account settlement, stock, cash sales, hire sales, installment reminders, and more—becoming a core part of your showroom management.',
    imageUrl: '/images/project/ezone.png',
    backgroundColor: 'bg-[#0d85ba]',
    projectScreenshotUrl: '/images/project/ezone.png',
  },
  {
    name: 'Real Estate Management',
    description:
      'Software for real estate businesses with accounts, project-wise estimates, flat booking, installment date reminders, and more—making your real estate operations much easier.',
    imageUrl: '/images/project/realstate.jpg',
    backgroundColor: 'bg-[#9d7a54]', // soft peach
    projectScreenshotUrl: '/images/project/realstate.jpg',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductShowcaseService {
  private readonly http = inject(HttpClient);
  private readonly productsSignal = signal<ProductShowcaseItem[]>([]);

  constructor() {
    this.seedFromStatic();
  }

  readonly products = computed(() => this.productsSignal());

  /**
   * Replace the current showcase products with new data.
   */
  setProducts(products: ProductShowcaseItem[]): void {
    this.productsSignal.set(products);
  }

  async loadFromApi(endpoint: string): Promise<void> {
    try {
      const products = await firstValueFrom(
        this.http.get<ProductShowcaseItem[]>(endpoint),
      );
      this.productsSignal.set(products);
    } catch (error) {
      console.error('Failed to load showcase products from API. Using static data.', error);
      this.seedFromStatic(true);
    }
  }

  private seedFromStatic(force = false): void {
    if (!force && this.productsSignal().length > 0) {
      return;
    }
    this.productsSignal.set(STATIC_SHOWCASE_PRODUCTS);
  }
}
