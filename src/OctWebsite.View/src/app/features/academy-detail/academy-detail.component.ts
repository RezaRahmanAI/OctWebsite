import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { AcademyPageApiService, AcademyTrackModel } from '../../core/services/academy-page-api.service';

@Component({
  selector: 'app-academy-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AssetUrlPipe],
  templateUrl: './academy-detail.component.html',
  styleUrls: ['./academy-detail.component.css'],
})
export class AcademyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AcademyPageApiService);

  readonly track = signal<AcademyTrackModel | undefined>(undefined);
  readonly loading = signal(true);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.loading.set(false);
      return;
    }

    this.api.fetchTrack(slug).subscribe({
      next: track => {
        this.track.set(track);
        this.loading.set(false);
      },
      error: () => {
        this.track.set(undefined);
        this.loading.set(false);
      },
    });
  }
}
