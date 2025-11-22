import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { trackDetails } from './academy-track.data';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';

@Component({
  selector: 'app-academy-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AssetUrlPipe],
  templateUrl: './academy-detail.component.html',
  styleUrls: ['./academy-detail.component.css'],
})
export class AcademyDetailComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  readonly track = computed(() => {
    const slug = this.slug();
    return slug ? trackDetails.find(track => track.slug === slug) : undefined;
  });
}
