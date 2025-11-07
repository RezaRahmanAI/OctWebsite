import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AcademyService } from '../../core/services';

@Component({
  selector: 'app-academy-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './academy-detail.component.html',
  styleUrls: ['./academy-detail.component.css'],
})
export class AcademyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly academyService = inject(AcademyService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  readonly track = computed(() => (this.slug() ? this.academyService.getBySlug(this.slug()!) : undefined));
}
