import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface ServiceDetail {
  name: string;
  description: string;
  deliverables: string[];
  outcomes: string[];
}

interface ServicesPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  categories: ServiceDetail[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ScrollRevealDirective],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  // Hardcoded example content (replace this with actual API call if needed)
  private _servicesContent = signal<ServicesPageContent>({
    header: {
      eyebrow: 'Our Expertise',
      title: 'Services We Offer',
      subtitle: 'We provide comprehensive, tailor-made solutions for businesses of all sizes.',
    },
    categories: [
      {
        name: 'Digital Marketing',
        description:
          'Grow your online presence with performance-driven marketing strategies and tools.',
        deliverables: [
          'SEO & Content Strategy',
          'Paid Media Campaigns',
          'Brand Development',
          'Analytics & Conversion Optimization',
        ],
        outcomes: ['Improved ROI', 'Brand Awareness', 'Higher Conversion Rates'],
      },
      {
        name: 'Software Development',
        description:
          'Custom software development for scalable, resilient solutions tailored to your needs.',
        deliverables: [
          'Custom Web and Mobile Apps',
          'Cloud-Based Solutions',
          'API Integrations',
          'DevOps and Automation',
        ],
        outcomes: ['Scalable Solutions', 'Increased Efficiency', 'Reduced Operational Costs'],
      },
      {
        name: 'UI/UX Design',
        description: 'Creating seamless and user-friendly interfaces that enhance user experience.',
        deliverables: [
          'Wireframes & Prototypes',
          'User-Centric Designs',
          'UI Kit Development',
          'Usability Testing',
        ],
        outcomes: ['Enhanced User Satisfaction', 'Higher Engagement Rates', 'Reduced Bounce Rates'],
      },
    ],
  });

  // Computed properties for dynamic access
  readonly header = computed(() => this._servicesContent().header);
  readonly categories = computed(() => this._servicesContent().categories);

  constructor() {}
}
