import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeContent } from '../../../../core/models/home-content.model';

const defaultHeroData: HomeContent['hero'] = {
  badge: 'ObjectCanvas Technology',
  title: 'One Alliance. Infinite Digital Outcomes.',
  description:
    'ObjectCanvas engineers mission-critical software and experiences while ZeroProgrammingBD mentors deliver the talent to scale them.',
  primaryCta: {
    label: 'Start Your Project',
    routerLink: '/contact'
  },
  secondaryCta: {
    label: 'Explore Academy',
    routerLink: '/academy'
  },
  highlightCard: {
    title: 'From Bangladesh to the World',
    description: 'Trusted by founders, enterprises, and governments across continents.'
  },
  highlightList: ['Product squads', 'Design systems', 'Live enablement'],
  video: {
    src: '/video/bg.mp4',
    poster: ''
  },
  featurePanel: {
    eyebrow: 'Global Delivery Model',
    title: 'Product squads meet academy mentors',
    description:
      'Strategy, engineering, and education move together so your teams ship faster and learn smarter.',
    metrics: [
      { label: 'Timezone aligned', value: 'Asia · EU · NA', theme: 'accent' },
      { label: 'Delivery Velocity', value: '2x faster GTM', theme: 'emerald' }
    ],
    partner: {
      label: 'Trusted partner',
      description: 'We pair mission-critical delivery with upskilling for lasting ownership.'
    }
  }
};

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent implements AfterViewInit {
  @Input() data: HomeContent['hero'] = defaultHeroData;
  @Input() videoSrc = '/video/bg.mp4';
  @Input() videoPoster = '';

  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay was blocked:', err);
      });
    }
  }
}
