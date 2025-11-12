import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { FormatStatPipe } from '../../../../shared/pipes/format-stat.pipe';

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
}
