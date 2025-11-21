import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrustedLogo {
  name: string;
  src: string;
  width?: number;
}

@Component({
  selector: 'app-home-trusted-by',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-trusted-by.component.html',
  styleUrl: './home-trusted-by.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTrustedByComponent {
  @Input({ required: false }) tagline?: string;
  @Input({ required: false }) companies: string[] | null = null;

  logos: TrustedLogo[] = [
    { name: 'Aurora Dynamics', src: '/images/trusted-by/aurora-dynamics.svg', width: 154 },
    { name: 'Crescent Labs', src: '/images/trusted-by/crescent-labs.svg', width: 150 },
    { name: 'Northwind Energy', src: '/images/trusted-by/northwind-energy.svg', width: 160 },
    { name: 'Summit Partners', src: '/images/trusted-by/summit-partners.svg', width: 152 },
    { name: 'Lumen Health', src: '/images/trusted-by/lumen-health.svg', width: 148 },
    { name: 'Silverline Finance', src: '/images/trusted-by/silverline-finance.svg', width: 164 },
    { name: 'Terra Logistics', src: '/images/trusted-by/terra-logistics.svg', width: 154 },
    { name: 'Horizon Networks', src: '/images/trusted-by/horizon-networks.svg', width: 160 },
  ];

  logoMarquee = [...this.logos, ...this.logos];
}
