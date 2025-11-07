import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ScrollToDirective } from '../../shared/directives/scroll-reveal.directive';

interface AboutPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  intro: string;
  values: { title: string; description: string }[];
  leadership: {
    title: string;
    description: string;
    highlights: string[];
    cta: {
      label: string;
      routerLink: string;
      fragment?: string;
    };
  };
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent, ScrollToDirective],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  // Hardcoded data (replace with actual data from API if needed)
  private _aboutContent = signal<AboutPageContent>({
    header: {
      eyebrow: 'About Us',
      title: 'Our Story',
      subtitle: 'Building partnerships through innovation and expertise.',
    },
    intro:
      'Our multidisciplinary team blends product strategists, engineers, data scientists, digital marketers, and educators. We believe the best partnerships combine delivery excellence with capability building, which is why Hum Academy is woven into every engagement.',
    values: [
      {
        title: 'Innovation',
        description:
          'We strive to solve complex challenges with innovative and practical solutions.',
      },
      {
        title: 'Collaboration',
        description:
          'We believe in strong partnerships that foster knowledge sharing and collective success.',
      },
      {
        title: 'Excellence',
        description: 'We are committed to delivering the highest quality in everything we do.',
      },
    ],
    leadership: {
      title: 'Meet Our Leadership Team',
      description: 'Our leadership team brings decades of experience in technology and business.',
      highlights: [
        'Over 50 years of combined industry experience',
        'Experts in tech development, business strategy, and education',
        'Passionate about delivering innovative solutions that make a global impact',
      ],
      cta: {
        label: 'Meet the Team',
        routerLink: '/team',
        fragment: 'leadership',
      },
    },
  });

  // Computed properties for dynamic access
  readonly header = computed(() => this._aboutContent().header);
  readonly intro = computed(() => this._aboutContent().intro);
  readonly values = computed(() => this._aboutContent().values);
  readonly leadership = computed(() => this._aboutContent().leadership);

  constructor() {}
}
