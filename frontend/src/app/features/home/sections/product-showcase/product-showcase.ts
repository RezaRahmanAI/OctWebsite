import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { SectionHeaderComponent } from "../../../../shared/components/section-header/section-header.component";

interface Product {
  name: string;
  description: string;
  imageUrl: string;
  backgroundColor: string; // Tailwind background classes
  projectScreenshotUrl: string; // Image shown in the card
}

@Component({
  selector: 'app-product-showcase',
  standalone: true,
  templateUrl: './product-showcase.html',
  styleUrls: ['./product-showcase.css'],
  imports: [NgFor, NgClass, SectionHeaderComponent],
})
export class ProductShowcaseComponent {
  public sectionName = 'Product Showcase';
  public sectionTitle = 'Our Custom Software Development Products';
  public sectionSubtitle =
    'We build robust, scalable, and efficient software products tailored to your business.';

  public products: Product[] = [
    {
      name: 'DMS',
      description:
        'DMS is a smart Distribution Business Management System that provides accounting, purchase, sales, SR control, and stock management via mobile app or website so you can fully control your products.',
      imageUrl: 'https://placehold.co/60x60/0ea5e9/ffffff.png?text=DMS',
      backgroundColor: 'bg-[#06ac30]', // soft mint
      projectScreenshotUrl: '/images/project/dms.jpg',
    },
    {
      name: 'Ebike',
      description:
        'Ebike is software for motorcycle showrooms, covering account settlement, stock, sales, purchases, and registration document preparation—an essential part of your showroom management.',
      imageUrl: 'https://placehold.co/60x60/22c55e/ffffff.png?text=EB',
      backgroundColor: 'bg-[#8b0101]', // soft blue
      projectScreenshotUrl: '/images/project/ebike.jpg',
    },
    {
      name: 'Ezone',
      description:
        'A software for electronics showrooms that gives you account settlement, stock, cash sales, hire sales, installment reminders, and more—becoming a core part of your showroom management.',
      imageUrl: 'https://placehold.co/60x60/22c55e/ffffff.png?text=EZ',
      backgroundColor: 'bg-[#7ec287]',
      projectScreenshotUrl: '/images/project/ezone.png',
    },
    {
      name: 'Real Estate Management',
      description:
        'Software for real estate businesses with accounts, project-wise estimates, flat booking, installment date reminders, and more—making your real estate operations much easier.',
      imageUrl: 'https://placehold.co/60x60/22c55e/ffffff.png?text=RE',
      backgroundColor: 'bg-[#FFEFD5]', // soft peach
      projectScreenshotUrl: '/images/project/realstate.jpg',
    },
  ];

  // Duplicate products so the marquee can loop seamlessly
  get marqueeProducts(): Product[] {
    return [...this.products, ...this.products];
  }
}
