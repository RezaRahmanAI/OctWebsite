import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-home-differentiators',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  templateUrl: './home-differentiators.component.html',
  styleUrl: './home-differentiators.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeDifferentiatorsComponent {
  @Input({ required: true }) data!: HomeContent['differentiators'];
}
