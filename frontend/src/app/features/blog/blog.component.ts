import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services';
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
  readonly searchTerm = signal('');
  readonly activeTag = signal<string | null>(null);

  readonly tags = this.blogService.tags;

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

  readonly heroVideoSrc = computed(
    () => this.featuredPost()?.headerVideoUrl || this.featuredPost()?.headerVideo?.url || '/video/blog.mp4',
  );

  ngOnInit(): void {
    this.blogService.ensureLoaded();
  }

  setTag(tag: string | null): void {
    this.activeTag.set(tag);
  }
}
