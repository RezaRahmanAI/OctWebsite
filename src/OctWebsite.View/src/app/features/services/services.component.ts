import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ServicesPageApiService, ServicesService } from '../../core/services';
import { ServiceItem } from '../../core/models';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { SectionHeadingComponent } from "../../shared/components/section-heading/section-heading.component"; // ← ADD

interface ServiceGroup {
  title: string;
  description: string;
  highlight: string;
  slugs: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    SectionHeaderComponent,
    RouterLink,
    AssetUrlPipe,
    SectionHeadingComponent
],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements AfterViewInit {
  private readonly servicesService = inject(ServicesService);
  private readonly servicesPageApi = inject(ServicesPageApiService);

  // === VIDEO AUTOPLAY (same bulletproof pattern as Blog/Product) ===
  @ViewChild('heroVideo')
  set heroVideoRef(video: ElementRef<HTMLVideoElement> | undefined) {
    this.heroVideo = video;
    this.autoplayHeroVideo();
  }
  private heroVideo?: ElementRef<HTMLVideoElement>;

  private readonly groups: ServiceGroup[] = [
    /* your groups unchanged */
  ];

  readonly services = this.servicesService.services;
  readonly isLoading = computed(() => this.servicesService.isLoading());

  readonly heroContent = this.servicesPageApi.content;
  readonly heroEyebrow = computed(() => this.heroContent()?.headerEyebrow || 'Services');
  readonly heroTitle = computed(
    () => this.heroContent()?.headerTitle || 'Services shaped to match your brand energy'
  );
  readonly heroSubtitle = computed(
    () =>
      this.heroContent()?.headerSubtitle ||
      'Engineering, cloud, security, content, and outsourcing squads that mirror the tone of your product and customers.'
  );
  readonly heroVideoUrl = computed(() => this.heroContent()?.heroVideo?.url || null); // ← allow null

  readonly groupedServices = computed(() =>
    this.groups
      .map((group) => ({
        ...group,
        services: group.slugs
          .map((slug) => this.services().find((s) => s.slug === slug))
          .filter(Boolean) as ServiceItem[],
      }))
      .filter((g) => g.services.length > 0)
  );

  constructor() {
    void this.servicesService.ensureLoaded();
    this.servicesPageApi.load();
  }

  ngAfterViewInit(): void {
    this.autoplayHeroVideo(); // fallback
  }

  private autoplayHeroVideo(): void {
    queueMicrotask(() => this.tryAutoplay(this.heroVideo?.nativeElement));
  }

  private tryAutoplay(video?: HTMLVideoElement | null): void {
    if (!video) return;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    if (video.paused) {
      video.play().catch(() => {
        /* expected silent fail */
      });
    }
  }
}
