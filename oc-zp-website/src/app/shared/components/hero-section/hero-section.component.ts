import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent {
  @Input() eyebrow?: string;
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() primaryLabel = 'Get Started';
  @Input() primaryLink = '/contact';
  @Input() secondaryLabel = 'Talk to us';
  @Input() secondaryLink = '/contact';
  @Input() mediaImage?: string;
  @Input() mediaPoster?: string;
  @Input() mediaVideo?: string;
  @Input() mediaAlt?: string;
  @Input() mediaBadge?: string;
  @Input() mediaCaption?: string;
  @Input() highlights: { value: string; label: string }[] = [];
}
