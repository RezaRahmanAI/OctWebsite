import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface AcademyTrack {
  title: string;
  description: string;
  modules: string[];
  outcomes: string[];
}

interface AcademyPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  tracks: AcademyTrack[];
}

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ScrollRevealDirective],
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademyComponent {
  // Hardcoded example content (replace this with actual API call if needed)
  private _academyContent = signal<AcademyPageContent>({
    header: {
      eyebrow: 'ZeroProgrammingBD Academy',
      title: 'Learn Technology, Build Careers',
      subtitle: 'Live online courses taught by industry experts. From beginner to professional.',
    },
    tracks: [
      {
        title: 'Full-Stack Web Development',
        description:
          'Become proficient in both front-end and back-end development with hands-on projects.',
        modules: ['HTML & CSS', 'JavaScript & TypeScript', 'Node.js & Express', 'MongoDB & NoSQL'],
        outcomes: [
          'Build full-stack web applications',
          'Learn industry-standard technologies',
          'Understand the fundamentals of web development',
        ],
      },
      {
        title: 'Digital Marketing & SEO',
        description: 'Master the art of online marketing and SEO to grow businesses and websites.',
        modules: ['SEO Basics', 'Content Marketing', 'Google Ads', 'Social Media Marketing'],
        outcomes: [
          'Drive organic traffic with SEO',
          'Develop content strategies',
          'Run successful ad campaigns on Google and social media',
        ],
      },
      {
        title: 'UI/UX Design',
        description:
          'Design user-centric websites and apps that are not only beautiful but functional.',
        modules: [
          'Wireframing & Prototyping',
          'User Research',
          'Usability Testing',
          'Figma & Adobe XD',
        ],
        outcomes: [
          'Create intuitive user interfaces',
          'Enhance user experience through design thinking',
          'Develop high-fidelity prototypes',
        ],
      },
    ],
  });

  // Computed properties for dynamic access
  readonly header = computed(() => this._academyContent().header);
  readonly tracks = computed(() => this._academyContent().tracks);

  constructor() {}
}
