import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

interface InsightEntry {
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
}

interface InsightsPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  entries: InsightEntry[];
}

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsightsComponent {
  // Static content for the insights page
  protected readonly insightsContent: InsightsPageContent = {
    header: {
      eyebrow: 'Tech Insights',
      title: 'Our Latest Insights',
      subtitle: 'In-depth articles and resources to keep you ahead of the curve.',
    },
    entries: [
      {
        title: 'Designing Omni-Channel Experiences for Emerging Markets',
        category: 'Case Study',
        excerpt:
          'How ObjectCanvas reimagined retail experiences with localized content and automation.',
        readTime: '7 min read',
      },
      {
        title: 'Scaling Engineering Teams with Academy-led Upskilling',
        category: 'Academy',
        excerpt: 'Building engineering excellence through custom training journeys and mentorship.',
        readTime: '5 min read',
      },
      {
        title: 'The Playbook for High-Converting SaaS Websites',
        category: 'Insights',
        excerpt: 'UI/UX strategies and experimentation frameworks that deliver measurable growth.',
        readTime: '8 min read',
      },
    ],
  };

  // Access the static data directly
  readonly header = this.insightsContent.header;
  readonly entries = this.insightsContent.entries;
}
