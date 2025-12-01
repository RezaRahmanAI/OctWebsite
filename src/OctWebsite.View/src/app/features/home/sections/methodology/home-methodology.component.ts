import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-methodology',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ScrollRevealDirective],
  templateUrl: './home-methodology.component.html',
  styleUrl: './home-methodology.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMethodologyComponent {
  @Input({ required: true }) data!: HomeContent['methodology'];

  positions = [
    { left: '10%', top: '18%' }, // card 1 (top-left)
    { left: '30%', top: '60%' }, // card 2 (lower center-left)
    { left: '50%', top: '18%' }, // card 3 (top-right center)
    { left: '70%', top: '62%' }, // card 4 (lower center-right)
    { left: '90%', top: '18%' }, // card 5 (top-right)
  ];
}


