import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { FormatStatPipe } from '../../../../shared/pipes/format-stat.pipe';

interface TrustedLogo {
  name: string;
  src: string;
}

@Component({
  selector: 'app-home-trust',
  standalone: true,
  imports: [CommonModule, FormatStatPipe],
  templateUrl: './home-trust.component.html',
  styleUrl: './home-trust.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTrustComponent {
  @Input({ required: true }) data!: HomeContent['trust'];

  private readonly trustedLogos: TrustedLogo[] = [
    { name: 'Walton', src: '/images/trusted-by/walton-logo-update.svg' },
    { name: 'Tricon', src: '/images/trusted-by/tricon.png' },
    { name: 'Arian', src: '/images/trusted-by/arian.png' },
    { name: 'Ashaven', src: '/images/trusted-by/ashaven.png' },
  ];

  marqueeRowOne = [...this.trustedLogos, ...this.trustedLogos];
}
