import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RouterLink } from '@angular/router';
import { ServicesPageApiService, ServicesService } from '../../core/services';
import { ServiceItem } from '../../core/models';

interface ServiceGroup {
  title: string;
  description: string;
  highlight: string;
  slugs: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  private readonly servicesService = inject(ServicesService);
  private readonly servicesPageApi = inject(ServicesPageApiService);

  private readonly groups: ServiceGroup[] = [
    {
      title: 'Digital Products & Platforms',
      description: 'Experiences engineered for every screen with resilient, cloud-ready foundations.',
      highlight: 'Web, mobile, and desktop builds stay on-brand and production-ready.',
      slugs: ['web-platform', 'windows', 'mobile-platform', 'apple', 'android', 'mobile'],
    },
    {
      title: 'Cloud, Security & Experience',
      description: 'Keep your stack secure, discoverable, and ready for scale with reliable operations.',
      highlight: 'From cloud landing zones to SEO and creative delivery, we keep you visible and protected.',
      slugs: [
        'cloud-service',
        'system-integration',
        'cyber-security-services',
        // 'enterprise-content-management',
        'search-engine-optimization-seo',
        'graphic-design',
        'web-listing',
      ],
    },
    // {
    //   title: 'Data, Content & GIS',
    //   description: 'Data-rich storytelling with governance for every channel and geography.',
    //   highlight: 'Content, GIS, and document practices that keep insights flowing safely.',
    //   slugs: [
    //     'content-provider-mobile-web-voice',
    //     'geographic-information-services-gis',
    //     'document-process-outsourcing-dpo',
    //     'knowledge-process-outsourcing-kpo',
    //     'data-entry',
    //     'it-enabled-services',
    //   ],
    // },
    // {
    //   title: 'Outsourcing & Operations',
    //   description: 'Specialized teams that plug into your business with measurable SLAs.',
    //   highlight: 'From contact centers to finance, we deliver governed processes and transparent metrics.',
    //   slugs: [
    //     'crm-outsourcing',
    //     'sales-marketing-outsourcing',
    //     'engineering-services-outsourcing-eso',
    //     'contact-call-centers',
    //     'facilities-management-outsourcing-fmo',
    //     'procurement-process-outsourcing',
    //     'legal-process-outsourcing-lpo',
    //     'human-resources-outsourcing-hro',
    //     'finance-accounting-outsourcing-fao',
    //     'business-process-outsourcing-bpo',
    //   ],
    // },
  ];

  readonly services = this.servicesService.services;
  readonly isLoading = computed(() => this.servicesService.isLoading());
  readonly heroContent = this.servicesPageApi.content;
  readonly heroEyebrow = computed(
    () => this.heroContent()?.headerEyebrow || 'Services',
  );
  readonly heroTitle = computed(
    () => this.heroContent()?.headerTitle || 'Services shaped to match your brand energy',
  );
  readonly heroSubtitle = computed(
    () =>
      this.heroContent()?.headerSubtitle ||
      'Engineering, cloud, security, content, and outsourcing squads that mirror the tone of your product and customers.',
  );
  readonly heroVideoUrl = computed(() =>
    this.heroContent()?.heroVideo?.url || '/video/service/service.mp4',
  );
  readonly groupedServices = computed(() =>
    this.groups
      .map(group => ({
        ...group,
        services: group.slugs
          .map(slug => this.services().find(service => service.slug === slug))
          .filter(Boolean) as ServiceItem[],
      }))
      .filter(group => group.services.length > 0),
  );

  constructor() {
    void this.servicesService.ensureLoaded();
    this.servicesPageApi.load();
  }
}
