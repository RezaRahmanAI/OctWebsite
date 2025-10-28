import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyService } from '../../core/services';
import { AcademyTrack } from '../../core/models';
import { CardComponent, SectionHeadingComponent } from '../../shared/components';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, CardComponent],
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.css'],
})
export class AcademyComponent {
  private readonly academyService = inject(AcademyService);
  readonly query = signal('');

  readonly tracks = computed(() => {
    const term = this.query().toLowerCase();
    const items = this.academyService.tracks();
    if (!term) {
      return items;
    }
    return items.filter(track => track.title.toLowerCase().includes(term));
  });

  toolsPreview(track: AcademyTrack): string {
    const firstLevel = track.levels[0];
    if (!firstLevel || firstLevel.tools.length === 0) {
      return 'Skills announced soon';
    }
    return firstLevel.tools.slice(0, 3).join(', ');
  }
}
