import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ServicesService } from '../../core/services';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css'],
})
export class ServiceDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly servicesService = inject(ServicesService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  readonly service = computed(() => (this.slug() ? this.servicesService.getBySlug(this.slug()!) : undefined));
  readonly relatedServices = computed(() =>
    (this.servicesService.all() || [])
      .filter(item => item.active && item.featured)
      .filter(item => item.slug !== this.service()?.slug)
      .slice(0, 3),
  );

  constructor() {
    void this.servicesService.ensureLoaded();
  }
}
