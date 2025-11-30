import { Component, ElementRef, OnInit, ViewChild, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PricingComponent } from '../../shared/components/pricing/pricing.component';
import { AcademyPageApiService, AcademyPageModel } from '../../core/services/academy-page-api.service';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';

type TrackSummary = AcademyPageModel['tracks'][number];

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterLink, PricingComponent, AssetUrlPipe],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.css',
})
export class AcademyComponent implements OnInit {
  @ViewChild('academyVideo', { static: false })
  academyVideo?: ElementRef<HTMLVideoElement>;

  private readonly api = inject(AcademyPageApiService);

  readonly page = computed(() => this.api.page());
  readonly kidsComputingFeatures = computed(() => this.page()?.kidsFeatures ?? []);
  readonly zeroProgrammingTracks = computed<TrackSummary[]>(() =>
    (this.page()?.tracks ?? []).filter(track => track.active)
  );
  readonly freelancingCourses = computed(() => this.page()?.freelancingCourses ?? []);

  ngOnInit(): void {
    this.api.loadPage();
  }

  ngAfterViewInit(): void {
    const video = this.academyVideo?.nativeElement;
    if (!video) return;

    video.muted = true; // ensure muted for autoplay policies

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        // Autoplay might still be blocked until user interaction
        console.warn('Autoplay prevented by browser:', err);
      });
    }
  }

  heroVideoSource(): string {
    return this.page()?.heroVideo?.url ?? this.page()?.heroVideo?.fileName ?? '/video/academy/hero.mp4';
  }
}
