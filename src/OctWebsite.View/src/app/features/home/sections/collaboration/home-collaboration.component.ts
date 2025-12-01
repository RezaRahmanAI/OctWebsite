import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CollaborationItem, HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-collaboration',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent, ScrollRevealDirective],
  templateUrl: './home-collaboration.component.html',
  styleUrl: './home-collaboration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeCollaborationComponent {
  @Input({ required: true }) data!: HomeContent['collaboration'];

  trackItem(index: number, item: CollaborationItem): string {
    return `${item.order}-${item.title}`;
  }
}
