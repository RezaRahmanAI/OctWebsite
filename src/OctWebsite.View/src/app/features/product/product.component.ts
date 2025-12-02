import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductPageApiService, ProductsService } from '../../core/services';
import { CardComponent } from '../../shared/components/card/card.component';
import { SectionHeadingComponent, SectionHeadingCta } from '../../shared/components/section-heading/section-heading.component';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe'; // ← ADD THIS

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    SectionHeadingComponent,
    CardComponent,
    AssetUrlPipe, // ← ADD THIS
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  private readonly productsService = inject(ProductsService);
  private readonly productPageApi = inject(ProductPageApiService);
  readonly query = signal('');

  // ==== HERO CONTENT ====
  readonly heroContent = this.productPageApi.content;
  readonly heroEyebrow = computed(() => this.heroContent()?.headerEyebrow || 'Product');
  readonly heroTitle = computed(
    () => this.heroContent()?.headerTitle || 'ObjectCanvas industry solutions'
  );
  readonly heroSubtitle = computed(
    () =>
      this.heroContent()?.headerSubtitle ||
      'Configured platforms ready to deploy for your vertical.'
  );
  readonly heroVideoUrl = computed(() => this.heroContent()?.heroVideo?.url || null); // ← allow null like Blog
  readonly heroCtas: SectionHeadingCta[] = [
    {
      label: 'Talk to product team →',
      routerLink: '/contact',
    },
    {
      label: 'See recent launches',
      routerLink: '/blog',
      variant: 'secondary',
    },
  ];

  // ==== VIDEO AUTOPLAY LOGIC (identical to Blog & About) ====
  @ViewChild('heroVideo')
  set heroVideoRef(video: ElementRef<HTMLVideoElement> | undefined) {
    this.heroVideo = video;
    this.autoplayHeroVideo();
  }
  private heroVideo?: ElementRef<HTMLVideoElement>;

  readonly products = computed(() => {
    const term = this.query().toLowerCase();
    const items = this.productsService.products();
    if (!term) return items;
    return items.filter(
      (p) => p.title.toLowerCase().includes(term) || p.summary.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.productsService.ensureLoaded();
    this.productPageApi.load();
  }

  ngAfterViewInit(): void {
    this.autoplayHeroVideo(); // fallback
  }

  private autoplayHeroVideo(): void {
    queueMicrotask(() => {
      this.tryAutoplay(this.heroVideo?.nativeElement);
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
        // expected silent fail on some browsers
      });
    }
  }
}
