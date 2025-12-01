import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPageApiService, BlogService } from '../../core/services';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly blogPageApi = inject(BlogPageApiService);
  readonly searchTerm = signal('');
  readonly activeTag = signal<string | null>(null);

  readonly tags = this.blogService.tags;

  readonly pageContent = this.blogPageApi.content;
  readonly heroEyebrow = computed(() => this.pageContent()?.headerEyebrow || 'Insights & Updates');
  readonly heroTitle = computed(() => this.pageContent()?.headerTitle || 'Stories from the studio');
  readonly heroSubtitle = computed(
    () =>
      this.pageContent()?.headerSubtitle ||
      'Explore lessons from our product experiments, engineering playbooks, and academy cohorts. Filter by topic or jump straight into the latest releases.',
  );
  readonly heroVideoUrl = computed(() => this.pageContent()?.heroVideo?.url || '/video/blog/hero.mp4');

  readonly posts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const tag = this.activeTag();
    return this.blogService.posts().filter(post => {
      const matchesTerm = !term || post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term);
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

  setTag(tag: string | null): void {
    this.activeTag.set(tag);
  }
}
