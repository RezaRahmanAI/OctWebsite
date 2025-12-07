import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import {
  SectionHeadingComponent,
  SectionHeadingCta,
} from '../../shared/components/section-heading/section-heading.component';
import {
  MethodologyPageApiService,
  MethodologyPageModel,
  MethodologyOfferingModel,
  MatrixColumnModel,
  MatrixFeatureModel,
  StatHighlightModel,
} from '../../core/services/methodology-page-api.service';

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent, SectionHeadingComponent, AssetUrlPipe],
  templateUrl: './methodology.component.html',
  styleUrls: ['./methodology.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodologyComponent implements OnInit, AfterViewInit {
  private readonly api = inject(MethodologyPageApiService);

  @ViewChild('methodologyVideo')
  set methodologyVideoRef(video: ElementRef<HTMLVideoElement> | undefined) {
    this.methodologyVideo = video;
    this.autoplayVideo();
  }
  private methodologyVideo?: ElementRef<HTMLVideoElement>;

  readonly page = computed<MethodologyPageModel | null>(() => this.api.page());
  readonly heroVideoUrl = computed(() => this.page()?.heroVideo?.url ?? null);
  readonly heroHighlights = computed<StatHighlightModel[]>(() => this.page()?.heroHighlights ?? []);
  readonly matrixColumns = computed<MatrixColumnModel[]>(() => this.page()?.matrixColumns ?? []);
  readonly featureMatrix = computed<MatrixFeatureModel[]>(() => this.page()?.featureMatrix ?? []);
  readonly offerings = computed<MethodologyOfferingModel[]>(() => this.page()?.offerings ?? []);

  readonly heroCtas: SectionHeadingCta[] = [
    {
      label: 'Talk to our team',
      routerLink: '/contact',
    },
    {
      label: 'View all services',
      routerLink: '/services',
      variant: 'secondary',
    },
  ];

  ngOnInit(): void {
    this.api.loadPage();
  }

  ngAfterViewInit(): void {
    this.autoplayVideo();
  }

  trackById(_: number, item: MethodologyOfferingModel): string {
    return item.id;
  }

  private autoplayVideo(): void {
    queueMicrotask(() => this.tryAutoplay(this.methodologyVideo?.nativeElement));
  }

  private tryAutoplay(video?: HTMLVideoElement | null): void {
    if (!video) return;

    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;

    if (video.paused) {
      video.play().catch(() => {
        // Autoplay may be blocked; safe to ignore
      });
    }
  }
}
