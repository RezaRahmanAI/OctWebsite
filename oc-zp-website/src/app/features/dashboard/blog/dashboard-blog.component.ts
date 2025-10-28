import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService, ToastService } from '../../../core/services';
import { createId } from '../../../core/utils/uuid';

@Component({
  selector: 'app-dashboard-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-blog.component.html',
  styleUrls: ['./dashboard-blog.component.css'],
})
export class DashboardBlogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly blogService = inject(BlogService);
  private readonly toast = inject(ToastService);

  readonly posts = this.blogService.all;
  readonly selectedId = signal<string | null>(null);
  readonly filter = signal('');
  readonly filtered = computed(() => {
    const term = this.filter().toLowerCase();
    if (!term) {
      return this.posts();
    }
    return this.posts().filter(post => post.title.toLowerCase().includes(term) || post.tags.some(tag => tag.toLowerCase().includes(term)));
  });

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    excerpt: ['', Validators.required],
    coverUrl: [''],
    content: ['', Validators.required],
    tags: [''],
    published: [true],
    publishedAt: [''],
  });

  newPost(): void {
    this.selectedId.set(null);
    this.form.reset({ published: true });
  }

  select(id: string): void {
    const post = this.blogService.getById(id);
    if (!post) {
      return;
    }
    this.selectedId.set(id);
    this.form.patchValue({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverUrl: post.coverUrl ?? '',
      content: post.content,
      tags: post.tags.join(', '),
      published: post.published,
      publishedAt: post.publishedAt ?? '',
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const payload = {
      title: value.title!,
      slug: value.slug!,
      excerpt: value.excerpt!,
      coverUrl: value.coverUrl ?? undefined,
      content: value.content!,
      tags: value.tags ? value.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      published: value.published ?? false,
      publishedAt: value.publishedAt || (value.published ? new Date().toISOString() : undefined),
    };
    if (this.selectedId()) {
      this.blogService.update(this.selectedId()!, payload);
      this.toast.show('Post updated', 'success');
    } else {
      this.blogService.create({ id: createId(), ...payload });
      this.toast.show('Post created', 'success');
    }
    this.newPost();
  }

  delete(id: string): void {
    if (confirm('Delete this post?')) {
      this.blogService.delete(id);
      this.toast.show('Post deleted', 'info');
      if (this.selectedId() === id) {
        this.newPost();
      }
    }
  }

  updateSlug(): void {
    const title = this.form.controls.title.value ?? '';
    if (!this.selectedId()) {
      this.form.controls.slug.setValue(this.slugify(title));
    }
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
