import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-services',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, ScrollRevealDirective],
  templateUrl: './home-services.component.html',
  styleUrl: './home-services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeServicesComponent {
  @Input({ required: true }) data!: HomeContent['services'];
}
