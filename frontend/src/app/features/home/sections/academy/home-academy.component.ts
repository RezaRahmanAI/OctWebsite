import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { FormatStatPipe } from '../../../../shared/pipes/format-stat.pipe';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-academy',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, FormatStatPipe, ScrollRevealDirective],
  templateUrl: './home-academy.component.html',
  styleUrl: './home-academy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeAcademyComponent {
  @Input({ required: true }) data!: HomeContent['academy'];
}
