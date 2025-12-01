import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import {
  kidsComputingFeatures,
  zeroProgrammingTracks,
  freelancingCourses,
} from '../../../../core/data/academy-programs.data';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { FormatStatPipe } from '../../../../shared/pipes/format-stat.pipe';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

interface ProgramCard {
  title: string;
  summary: string;
  audience: string;
  icon: string;
  highlights: string[];
  cta: { label: string; routerLink: string | any[]; fragment?: string };
}

@Component({
  selector: 'app-home-academy',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, FormatStatPipe, ScrollRevealDirective],
  templateUrl: './home-academy.component.html',
  styleUrl: './home-academy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeAcademyComponent {
  @Input({ required: true }) data!: HomeContent['academy'];

  readonly programCards: ProgramCard[] = [
    {
      title: 'Kids Computing',
      audience: 'Ages 7–16 · STEM.org accredited labs',
      icon: '🧸',
      summary: 'Creative coding, robotics, and playful STEM foundations with small cohorts.',
      highlights: kidsComputingFeatures.slice(0, 3).map(feature => feature.title),
      cta: { label: 'Explore Kids Computing', routerLink: '/academy', fragment: 'kids' },
    },
    {
      title: 'Zero Programming',
      audience: 'Track-based progression · Beginner friendly',
      icon: '🚀',
      summary: 'Visual coding to real-world apps with mentor-led, confidence-building tracks.',
      highlights: zeroProgrammingTracks.map(track => `${track.title} — ${track.age.replace('For ', '')}`),
      cta: { label: 'See Track Details', routerLink: '/academy', fragment: 'zero' },
    },
    {
      title: 'Freelancing Launchpad',
      audience: 'Client-ready portfolio pathways',
      icon: '💼',
      summary: 'Skill up for web, design, and marketing gigs with practical delivery playbooks.',
      highlights: freelancingCourses.map(course => course.title),
      cta: { label: 'View Freelancing Path', routerLink: '/academy', fragment: 'freelancing' },
    },
  ];
}
