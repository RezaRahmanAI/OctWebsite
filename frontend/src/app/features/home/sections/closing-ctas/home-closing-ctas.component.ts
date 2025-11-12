import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';

@Component({
  selector: 'app-home-closing-ctas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-closing-ctas.component.html',
  styleUrl: './home-closing-ctas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeClosingCtasComponent {
  @Input({ required: true }) data!: HomeContent['closingCtas'];
}
