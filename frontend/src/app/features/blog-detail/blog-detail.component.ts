import { CommonModule } from '@angular/common';
import { Component, SecurityContext, computed, inject } from '@angular/core';
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
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  readonly post = computed(() => (this.slug() ? this.blogService.getBySlug(this.slug()!) : undefined));
  readonly safeContent = computed(() => {
    const content = this.post()?.content;
    if (!content) {
      return null;
    }

    return (
      this.sanitizer.sanitize(SecurityContext.HTML, content) ?? ''
    );
  });
}
