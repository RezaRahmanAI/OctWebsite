import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

interface PortfolioItem {
  title: string;
  client: string;
  region: string;
  summary: string;
  tags: string[];
}

interface PortfolioPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  work: PortfolioItem[];
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  // Static content for the portfolio
  protected readonly portfolioContent: PortfolioPageContent = {
    header: {
      eyebrow: 'Our Work',
      title: 'Portfolio',
      subtitle: 'A selection of the projects we’ve delivered.',
    },
    work: [
      {
        title: 'Project Alpha',
        client: 'TechCorp Inc.',
        region: 'North America',
        summary:
          'A complete digital transformation for a leading tech company, improving user engagement by 40%.',
        tags: ['Digital Transformation', 'Tech', 'Engagement'],
      },
      {
        title: 'E-Commerce Redesign',
        client: 'Retail World',
        region: 'Europe',
        summary: 'Revamping an e-commerce platform to increase sales conversion by 30%.',
        tags: ['E-Commerce', 'Redesign', 'UI/UX'],
      },
      {
        title: 'Mobile Banking App',
        client: 'FinTech Solutions',
        region: 'Asia',
        summary:
          'Developed a secure mobile banking app, enhancing accessibility and security for users.',
        tags: ['Banking', 'Mobile App', 'Security'],
      },
    ],
  };

  // Access the static data
  readonly header = this.portfolioContent.header;
  readonly work = this.portfolioContent.work;
}
