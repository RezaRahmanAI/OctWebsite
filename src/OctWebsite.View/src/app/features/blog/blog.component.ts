import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPageApiService, BlogService } from '../../core/services';
import { SectionHeadingComponent, SectionHeadingCta } from '../../shared/components/section-heading/section-heading.component';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, AssetUrlPipe],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit, AfterViewInit {
  private readonly blogService = inject(BlogService);
  private readonly blogPageApi = inject(BlogPageApiService);

  readonly searchTerm = signal('');
  readonly activeTag = signal<string | null>(null);

  readonly heroCtas: SectionHeadingCta[] = [
    {
      label: 'Talk to the team →',
      routerLink: '/contact',
    },
    {
      label: 'View all insights',
      routerLink: '/insights',
      variant: 'secondary',
    },
  ];

  // This setter ensures autoplay runs EVERY time the video element appears
  @ViewChild('heroVideo')
  set heroVideoRef(video: ElementRef<HTMLVideoElement> | undefined) {
    this.heroVideo = video;
    this.autoplayHeroVideo(); // ← Critical: runs every time video is set
  }
  private heroVideo?: ElementRef<HTMLVideoElement>;

  readonly tags = this.blogService.tags;

  readonly pageContent = this.blogPageApi.content;
  readonly heroEyebrow = computed(() => this.pageContent()?.headerEyebrow || 'Insights & Updates');
  readonly heroTitle = computed(() => this.pageContent()?.headerTitle || 'Stories from the studio');
  readonly heroSubtitle = computed(
    () =>
      this.pageContent()?.headerSubtitle ||
      'Explore lessons from our product experiments, engineering playbooks, and academy cohorts. Filter by topic or jump straight into the latest releases.'
  );
  readonly heroVideoUrl = computed(() => this.pageContent()?.heroVideo?.url || null); // ← Allow null!

  readonly posts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const tag = this.activeTag();
    return this.blogService.posts().filter((post) => {
      const matchesTerm =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term);
      const matchesTag = !tag || post.tags.includes(tag);
      return matchesTerm && matchesTag;
    });
  });

  readonly featuredPost = computed(() => this.posts()[0] ?? null);
  readonly remainingPosts = computed(() => this.posts().slice(1));

  ngOnInit(): void {
    this.blogService.ensureLoaded();
    this.blogPageApi.load();
  }

  ngAfterViewInit(): void {
    this.autoplayHeroVideo(); // Still good to have as fallback
  }

  setTag(tag: string | null): void {
    this.activeTag.set(tag);
  }

  // Exactly the same as AboutComponent — robust autoplay
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
        // Silently fail — browsers block autoplay sometimes
        // This is expected and safe
      });
    }
  }
}