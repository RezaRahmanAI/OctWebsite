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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeMethodologyComponent {
  @Input({ required: true }) data!: HomeContent['methodology'];
}
