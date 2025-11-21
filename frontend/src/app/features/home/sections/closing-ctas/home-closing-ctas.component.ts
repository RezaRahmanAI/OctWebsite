import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-closing-ctas',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './home-closing-ctas.component.html',
  styleUrl: './home-closing-ctas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeClosingCtasComponent {
  @Input({ required: true }) data!: HomeContent['closingCtas'];
}
