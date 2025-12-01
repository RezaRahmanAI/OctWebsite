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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTrustComponent {
  // Data now expected to come from API (via parent trustData()),
  // no internal static fallback.
  @Input({ required: true }) data!: HomeContent['trust'];

  get marqueeRowOne(): TrustedLogo[] {
    const logos =
      this.data?.logos?.map((logo) => ({
        name: logo.alt ?? 'Trusted company',
        src: logo.src,
      })) ?? [];

    // Repeat for smooth infinite marquee
    return [...logos, ...logos];
  }
}
