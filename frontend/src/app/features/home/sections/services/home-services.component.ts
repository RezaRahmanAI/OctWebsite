import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-services',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, ScrollRevealDirective],
  templateUrl: './home-services.component.html',
  styleUrl: './home-services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeServicesComponent {
  @Input({ required: true }) data!: HomeContent['services'];
  backgroundImages: string[] = [
    // 0 - Software Development
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',

    // 1 - Website Building
    'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1400&q=80',

    // 2 - Digital Marketing
    'https://online.hbs.edu/Style%20Library/api/resize.aspx?imgpath=/PublishingImages/blog/posts/digital-marketing-skills.jpg&w=1200&h=630',

    // 3 - UI/UX Design
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80',

    // 4 - Cross-Platform Mobile Apps
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80',

    // 5 - Software Quality Assurance (SQA)
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',

    // 6 - Database & DBMS Solutions
    'https://i.postimg.cc/sX7gYM90/dbms.png',

    // 7 - Cloud Infrastructure & Services
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1400&q=80',

  ];
}
