import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-home-global-presence',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  templateUrl: './home-global-presence.component.html',
  styleUrl: './home-global-presence.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeGlobalPresenceComponent {
  @Input({ required: true }) data!: HomeContent['globalPresence'];
}
