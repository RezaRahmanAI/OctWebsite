import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PricingComponent } from '../../shared/components/pricing/pricing.component';

interface AcademyFeature {
  title: string;
  description: string;
  icon: string;
}

interface Track {
  id: string;
  title: string;
  age: string;
  description: string;
  slug: string;
}

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterLink, PricingComponent],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.css',
})
export class AcademyComponent {
  @ViewChild('academyVideo', { static: false })
  academyVideo?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.academyVideo?.nativeElement;
    if (!video) return;

    video.muted = true; // ensure muted for autoplay policies

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        // Autoplay might still be blocked until user interaction
        console.warn('Autoplay prevented by browser:', err);
      });
    }}


  readonly kidsComputingFeatures: AcademyFeature[] = [
    {
      title: 'STEM.org Accredited',
      description: 'Dolor sit am Provide Ipsum learning tailored for young innovators.',
      icon: '🎓',
    },
    {
      title: 'Project Based Learning',
      description: 'Build games, animations, and inventions that spark curiosity.',
      icon: '🧠',
    },
    {
      title: 'Skilled Instructors',
      description: 'Mentors who translate complex topics into playful experiences.',
      icon: '👩‍🏫',
    },
    {
      title: 'Comprehensive Curriculum',
      description: 'Progressive modules covering coding, robotics, and creativity.',
      icon: '📘',
    },
    {
      title: 'Small Batch Size',
      description: 'Maximum 10 students to ensure every child receives attention.',
      icon: '🤝',
    },
  ];

  readonly zeroProgrammingTracks: Track[] = [
    {
      id: 'track-1',
      title: 'Track-1',
      age: 'For ages 7-8',
      description: 'Kickstart logical thinking and playful coding through visual storytelling.',
      slug: 'track-1-little-programmer',
    },
    {
      id: 'track-2',
      title: 'Track-2',
      age: 'For ages 9-10',
      description: 'Level up with interactive projects, block-based programming, and robotics.',
      slug: 'track-2-young-builder',
    },
    {
      id: 'track-3',
      title: 'Track-3',
      age: 'For ages 11-16',
      description:
        'Transition into real code, build apps, and explore design-led entrepreneurship.',
      slug: 'track-3-future-founder',
    },
  ];

  readonly freelancingCourses: AcademyFeature[] = [
    {
      title: 'Web Development',
      description: 'Modern stacks, responsive design, and client collaboration skills.',
      icon: '💻',
    },
    {
      title: 'Graphics & Branding',
      description: 'Logo design, brand systems, and storytelling with visuals.',
      icon: '🎨',
    },
    {
      title: 'Digital Marketing',
      description: 'Learn funnels, SEO, and automation for online success.',
      icon: '📈',
    },
  ];
}
