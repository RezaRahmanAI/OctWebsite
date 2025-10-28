import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services';
import { CardComponent, SectionHeadingComponent } from '../../shared/components';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, CardComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent {
  private readonly servicesService = inject(ServicesService);
  readonly query = signal('');

  readonly services = computed(() => {
    const term = this.query().toLowerCase();
    const items = this.servicesService.services();
    if (!term) {
      return items;
    }
    return items.filter(service => service.title.toLowerCase().includes(term) || service.summary.toLowerCase().includes(term));
  });
}
