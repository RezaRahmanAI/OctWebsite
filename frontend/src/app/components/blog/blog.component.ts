import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NgFor, DatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent {
  private readonly api = inject(ApiService);

  readonly posts = toSignal(this.api.getBlogPosts(), { initialValue: [] as BlogPost[] });
}
