import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPageApiService, BlogService } from '../../core/services';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, AssetUrlPipe],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
  private readonly blogService = inject(BlogService);
  private readonly blogPageApi = inject(BlogPageApiService);
  readonly searchTerm = signal('');
  readonly activeTag = signal<string | null>(null);

  readonly tags = this.blogService.tags;

  readonly pageContent = this.blogPageApi.content;

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

  readonly heroVideoSrc = computed(() =>
    this.featuredPost()?.headerVideoUrl ||
    this.featuredPost()?.headerVideo?.url ||
    this.pageContent()?.heroVideo?.url ||
    this.pageContent()?.heroVideo?.fileName ||
    '/video/blog/hero.mp4'
  );

  ngOnInit(): void {
    this.blogService.ensureLoaded();
    this.blogPageApi.load();
  }

  setTag(tag: string | null): void {
    this.activeTag.set(tag);
  }
}
