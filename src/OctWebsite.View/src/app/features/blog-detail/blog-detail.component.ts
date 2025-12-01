import { CommonModule } from '@angular/common';
import { Component, OnInit, SecurityContext, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BlogService } from '../../core/services';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  readonly post = computed(() => (this.slug() ? this.blogService.getBySlug(this.slug()!) : undefined));
  readonly isLoading = this.blogService.isLoading;
  readonly safeContent = computed(() => {
    const content = this.post()?.content;
    if (!content) {
      return null;
    }

    return (
      this.sanitizer.sanitize(SecurityContext.HTML, content) ?? ''
    );
  });

  readonly readTime = computed(() => {
    const post = this.post();
    if (!post) {
      return null;
    }

    if (post.readTime) {
      return post.readTime;
    }

    const words = post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 220));
    return `${minutes} min read`;
  });

  readonly relatedPosts = computed(() => {
    const currentSlug = this.slug();
    return this.blogService
      .posts()
      .filter(post => post.slug !== currentSlug)
      .slice(0, 3);
  });

  ngOnInit(): void {
    this.blogService.ensureLoaded();
  }
}
