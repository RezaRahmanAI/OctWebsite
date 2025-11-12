import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-home-insights',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink],
  templateUrl: './home-insights.component.html',
  styleUrl: './home-insights.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeInsightsComponent {
  @Input({ required: true }) data!: HomeContent['insights'];
}
