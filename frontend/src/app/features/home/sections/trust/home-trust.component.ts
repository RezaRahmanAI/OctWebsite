import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { FormatStatPipe } from '../../../../shared/pipes/format-stat.pipe';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

interface TrustedLogo {
  name: string;
  src: string;
}

@Component({
  selector: 'app-home-trust',
  standalone: true,
  imports: [CommonModule, FormatStatPipe, ScrollRevealDirective],
  templateUrl: './home-trust.component.html',
  styleUrl: './home-trust.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTrustComponent {
  @Input({ required: true }) data!: HomeContent['trust'];

  private readonly fallbackLogos: TrustedLogo[] = [
    { name: 'Walton', src: '/images/trusted-by/walton-logo-update.svg' },
    { name: 'Tricon', src: '/images/trusted-by/tricon.png' },
    { name: 'Arian', src: '/images/trusted-by/arian.png' },
    { name: 'Ashaven', src: '/images/trusted-by/ashaven.png' },
  ];

  get marqueeRowOne(): TrustedLogo[] {
    const logos = this.data?.logos?.length
      ? this.data.logos.map(logo => ({ name: logo.alt ?? 'Trusted company', src: logo.src }))
      : this.fallbackLogos;

    return [...logos, ...logos];
  }
}
