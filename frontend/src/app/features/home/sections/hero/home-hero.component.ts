import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeroComponent {
  @Input({ required: true }) data!: HomeContent['hero'];
  @Input() videoSrc = '';
  @Input() videoPoster = '';
}
