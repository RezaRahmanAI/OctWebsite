import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { ServicesService } from '../../../../core/services';

@Component({
  selector: 'app-home-services',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, RouterLink, ScrollRevealDirective],
  templateUrl: './home-services.component.html',
  styleUrl: './home-services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeServicesComponent {
  @Input({ required: true }) header!: HomeContent['services']['header'];

  private readonly servicesService = inject(ServicesService);

  readonly services = computed(() => this.servicesService.featuredServices());

  constructor() {
    void this.servicesService.ensureLoaded();
  }
}
