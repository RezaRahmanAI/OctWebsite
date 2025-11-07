import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

interface LegalCopy {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

const LEGAL_CONTENT: Record<string, LegalCopy> = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'We respect your privacy and comply with global data protection regulations. This summary outlines how Hum Tech & Academy collects, processes, and safeguards information.',
    sections: [
      {
        heading: 'Data Collection & Usage',
        body:
          'We collect necessary data for project delivery, academy enrollment, and marketing communications. Data is never sold and is retained only for legitimate business purposes.'
      },
      {
        heading: 'Security & Compliance',
        body:
          'Our infrastructure follows ISO27001-aligned controls with encryption at rest and in transit. Regional compliance (GDPR, CCPA, PDPA) is supported when required.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    intro:
      'By partnering with Hum Tech & Academy, you agree to the following terms governing engagements, intellectual property, and payment schedules.',
    sections: [
      {
        heading: 'Engagement Model',
        body:
          'Statements of Work define scope, milestones, and deliverables. Additional requests are handled through change requests or managed services retainers.'
      },
      {
        heading: 'Intellectual Property',
        body:
          'Upon full payment, all custom work product is transferred to the client. Hum Tech retains rights to internal tooling and accelerators used in delivery.'
      }
    ]
  },
  refund: {
    title: 'Refund Policy',
    intro:
      'We aim for complete satisfaction across services and academy programs. Refunds are evaluated case-by-case with transparent communication throughout the process.',
    sections: [
      {
        heading: 'Services',
        body:
          'Professional service engagements follow the terms defined in the statement of work. Deposits and completed milestones are non-refundable.'
      },
      {
        heading: 'Academy Programs',
        body:
          'Course fees are refundable up to 7 days before cohort start. Prorated credits are available for exceptional circumstances with documentation.'
      }
    ]
  }
};

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = signal('privacy');

  protected readonly copy = computed(() => LEGAL_CONTENT[this.slug()] ?? LEGAL_CONTENT['privacy']);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.slug.set(params.get('page') ?? 'privacy');
    });
  }
}
