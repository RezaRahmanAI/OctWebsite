import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

interface ValueItem {
  title: string;
  description: string;
}

interface Leadership {
  title: string;
  description: string;
  highlights: string[];
  cta: {
    label: string;
    routerLink: string;
    fragment?: string;
  };
}

interface TeamMember {
  name: string;
  role: string;
  focus?: string;
  location?: string;
  avatarUrl?: string;
}

interface TeamSection {
  title: string;
  subtitle: string;
  note?: string;
  members: TeamMember[];
}

interface AchievementStat {
  label: string;
  value: string;
  description: string;
}

interface AchievementsSection {
  title: string;
  subtitle: string;
  highlightLines: string[];
  stats: AchievementStat[];
}

interface AboutPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  intro: string; // Who we are text
  mission: string;
  story: string;
  values: ValueItem[];
  leadership: Leadership;
  achievements: AchievementsSection;
  team: TeamSection;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private _aboutContent = signal<AboutPageContent>({
    header: {
      eyebrow: 'About Us',
      title: 'ObjectCanvas Technology',
      subtitle:
        'Engineering teams, educators, and strategists building products and people together.',
    },
    intro:
      'ObjectCanvas engineers, product strategists, data practitioners, and ZeroProgrammingBD educators work as one integrated team. We combine delivery excellence with capability building so every engagement ships both outcomes and skills.',
    mission:
      'To help ambitious teams design, build, and scale digital products while growing the next generation of engineers and creators across Bangladesh and beyond.',
    story:
      'ObjectCanvas started as a focused engineering partner helping teams ship quickly. Over time, we evolved into a multi-discipline studio spanning product strategy, cloud-native engineering, data, design, and a dedicated academy for young and early-career talent.',
    values: [
      {
        title: 'Craft over shortcuts',
        description:
          'We care deeply about code quality, design systems, and operational excellence instead of one-off hacks.',
      },
      {
        title: 'Teach while we build',
        description:
          'Every project is a chance to upskill clients, students, and our own team through pairing, documentation, and open playbooks.',
      },
      {
        title: 'Long-term partnerships',
        description:
          'We prefer fewer, deeper relationships where we can own outcomes, not just deliver tickets.',
      },
    ],
    leadership: {
      title: 'Leadership & Stewardship',
      description:
        'Our leadership blends experience from product companies, agencies, and education. The focus is simple: do work we are proud of, and leave teams stronger than we found them.',
      highlights: [
        'Cross-functional leadership across engineering, design, and education',
        'Hands-on involvement in architecture, reviews, and curriculum design',
        'Committed to building opportunities for Bangladeshi engineers and learners',
      ],
      cta: {
        label: 'Meet the team',
        routerLink: '/team',
        fragment: 'leadership',
      },
    },
    achievements: {
      title: "What we've achieved so far",
      subtitle:
        'Signals that the way we work scales – across clients, regions, and cross-cultural teams.',
      highlightLines: [
        'Serving global clients across multiple industries.',
        'More than 20 years of combined experience across the leadership team.',
        'We believe in respecting and embracing cross-cultural and cross-linguistic diversity.',
        'Clients from regions such as Japan, Europe, and the USA.',
      ],
      stats: [
        {
          label: 'Countries',
          value: '8+',
          description: 'Delivery partners, client locations, and affiliated companies worldwide.',
        },
        {
          label: 'Years',
          value: '22+',
          description: 'More than two decades of global working experience across the core team.',
        },
        {
          label: 'Clients',
          value: '50+',
          description: 'Over 50 clients and product partners served worldwide.',
        },
        {
          label: 'Projects',
          value: '1000+',
          description: 'Platforms, products, and experiments shipped across industries.',
        },
        {
          label: 'Engineers',
          value: '750+',
          description: 'Engineers and specialists collaborated with across distributed teams.',
        },
      ],
    },
    team: {
      title: 'The team behind ObjectCanvas',
      subtitle:
        'A compact, cross-functional group of builders, mentors, and operators working across product, platform, and academy tracks.',
      note: 'This is a snapshot of the people you will pair with on strategy, delivery, and training.',
      members: [
        {
          name: 'Tasfic Solaiman',
          role: 'Founder · Principal Engineer',
          focus: 'Architecture, product strategy, engineering leadership',
          location: 'Dhaka, Bangladesh',
          avatarUrl: '/images/team/team.jpg',
        },
        {
          name: 'Senior Engineering Lead',
          role: 'Full-stack & Cloud',
          focus: 'Distributed systems, performance, and delivery excellence',
          location: 'Dhaka · Remote',
          avatarUrl: '/images/team/team.jpg',
        },
        {
          name: 'Academy Lead',
          role: 'ZeroProgrammingBD',
          focus: 'Curriculum design, cohort facilitation, and mentorship',
          location: 'Rajshahi, Bangladesh',
          avatarUrl: '/images/team/team.jpg',
        },
        {
          name: 'Design & Brand Partner',
          role: 'Product Design',
          focus: 'Experience design, visual systems, and design ops',
          location: 'Remote',
          avatarUrl: '/images/team/team.jpg',
        },
      ],
    },
  });

  readonly header = computed(() => this._aboutContent().header);
  readonly intro = computed(() => this._aboutContent().intro);
  readonly mission = computed(() => this._aboutContent().mission);
  readonly story = computed(() => this._aboutContent().story);
  readonly values = computed(() => this._aboutContent().values);
  readonly leadership = computed(() => this._aboutContent().leadership);
  readonly achievements = computed(() => this._aboutContent().achievements);
  readonly team = computed(() => this._aboutContent().team);

  getInitials(name: string | undefined | null): string {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('');
  }
}
