import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-home-case-studies',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink],
  templateUrl: './home-case-studies.component.html',
  styleUrl: './home-case-studies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeCaseStudiesComponent {
  @Input({ required: true }) data!: HomeContent['caseStudies'];
}
