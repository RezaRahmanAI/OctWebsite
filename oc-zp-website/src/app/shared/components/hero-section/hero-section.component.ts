import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);

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
  @Input()
  set backgroundVideoId(value: string | undefined) {
    this._backgroundVideoId = value?.trim();
    this.backgroundVideoUrl = this._backgroundVideoId
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube-nocookie.com/embed/${this._backgroundVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${this._backgroundVideoId}&modestbranding=1&playsinline=1`
        )
      : undefined;
  }
  get backgroundVideoId(): string | undefined {
    return this._backgroundVideoId;
  }

  protected backgroundVideoUrl?: SafeResourceUrl;

  private _backgroundVideoId?: string;
}
