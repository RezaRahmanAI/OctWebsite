import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  computed,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PricingComponent } from '../../shared/components/pricing/pricing.component';
import {
  AcademyPageApiService,
  AcademyPageModel,
} from '../../core/services/academy-page-api.service';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';

type TrackSummary = AcademyPageModel['tracks'][number];

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterLink, PricingComponent, AssetUrlPipe],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.css',
})
export class AcademyComponent implements OnInit, AfterViewInit {
  private readonly api = inject(AcademyPageApiService);

  // Robust video handling — same pattern as About & Blog
  @ViewChild('academyVideo')
  set academyVideoRef(video: ElementRef<HTMLVideoElement> | undefined) {
    this.academyVideo = video;
    this.autoplayVideo();
  }
  private academyVideo?: ElementRef<HTMLVideoElement>;

  readonly page = computed(() => this.api.page());
  readonly heroVideoUrl = computed(() => this.page()?.heroVideo?.url ?? null);

  readonly kidsComputingFeatures = computed(() => this.page()?.kidsFeatures ?? []);
  readonly zeroProgrammingTracks = computed<TrackSummary[]>(() =>
    (this.page()?.tracks ?? []).filter((track) => track.active)
  );
  readonly freelancingCourses = computed(() => this.page()?.freelancingCourses ?? []);

  ngOnInit(): void {
    this.api.loadPage();
  }

  ngAfterViewInit(): void {
    this.autoplayVideo(); // Fallback
  }

  // Same bulletproof autoplay as About & Blog pages
  private autoplayVideo(): void {
    queueMicrotask(() => {
      this.tryAutoplay(this.academyVideo?.nativeElement);
    });
  }

  private tryAutoplay(video?: HTMLVideoElement | null): void {
    if (!video) return;

    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;

    if (video.paused) {
      video.play().catch(() => {
        // Autoplay blocked — expected in some browsers
      });
    }
  }
}
