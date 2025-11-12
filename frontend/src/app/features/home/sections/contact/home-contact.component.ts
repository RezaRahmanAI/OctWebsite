import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-home-contact',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink],
  templateUrl: './home-contact.component.html',
  styleUrl: './home-contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContactComponent {
  @Input({ required: true }) data!: HomeContent['contact'];
}
