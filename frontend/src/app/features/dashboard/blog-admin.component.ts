import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogApiService, SaveBlogRequest } from '../../core/services/blog-api.service';
import { BlogPageApiService, BlogPageModel, SaveBlogPageRequest } from '../../core/services/blog-page-api.service';
import { BlogPost } from '../../core/models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-blog-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class BlogAdminComponent implements OnInit {
  private readonly api = inject(BlogApiService);
  private readonly pageApi = inject(BlogPageApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly posts = signal<BlogPost[]>([]);
  readonly editingId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly headerLoading = signal(false);
  readonly thumbnailPreview = signal<string | null>(null);
  readonly headerVideoName = signal<string | null>(null);
  readonly heroVideoName = signal<string | null>(null);

  private thumbnailFile: File | null = null;
  private headerVideoFile: File | null = null;
  private heroVideoFile: File | null = null;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    excerpt: ['', Validators.required],
    content: ['', Validators.required],
    tags: [''],
    published: [true],
    publishedAt: [''],
    author: [''],
    authorTitle: [''],
    readTime: [''],
    heroQuote: [''],
    keyPoints: [''],
    stats: this.fb.array([
      this.fb.group({
        label: [''],
        value: [''],
      }),
    ]),
  });

  readonly headerForm = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    heroVideoFileName: [''],
  });

  get stats(): FormArray {
    return this.form.get('stats') as FormArray;
  }

  readonly statControls = computed(() => this.stats.controls as FormGroup[]);

  ngOnInit(): void {
    this.loadHeader();
    this.loadPosts();
  }

  saveHeader(): void {
    if (this.headerForm.invalid) {
      this.headerForm.markAllAsTouched();
      return;
    }

    const payload: SaveBlogPageRequest = {
      headerEyebrow: this.headerForm.value.headerEyebrow ?? '',
      headerTitle: this.headerForm.value.headerTitle ?? '',
      headerSubtitle: this.headerForm.value.headerSubtitle ?? '',
      heroVideoFileName: this.heroVideoFile ? null : this.headerForm.value.heroVideoFileName || null,
      heroVideoFile: this.heroVideoFile,
    };

    this.headerLoading.set(true);
    this.pageApi.update(payload).subscribe({
      next: page => {
        this.applyHeader(page);
        this.toast.show('Blog header saved', 'success');
        this.headerLoading.set(false);
      },
      error: () => {
        this.toast.show('Unable to save blog header', 'error');
        this.headerLoading.set(false);
      },
    });
  }

  addStat(): void {
    this.stats.push(
      this.fb.group({
        label: [''],
        value: [''],
      }),
    );
  }

  removeStat(index: number): void {
    if (this.stats.length <= 1) {
      this.stats.at(0).reset();
      return;
    }
    this.stats.removeAt(index);
  }

  edit(post: BlogPost): void {
    this.editingId.set(post.id);
    this.thumbnailFile = null;
    this.headerVideoFile = null;
    this.thumbnailPreview.set(post.thumbnailUrl ?? post.coverUrl ?? null);
    this.headerVideoName.set(post.headerVideo?.fileName ?? null);

    this.form.patchValue({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      published: post.published,
      publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : '',
      author: post.author ?? '',
      authorTitle: post.authorTitle ?? '',
      readTime: post.readTime ?? '',
      heroQuote: post.heroQuote ?? '',
      keyPoints: (post.keyPoints ?? []).join('\n'),
    });

    this.stats.clear();
    (post.stats ?? [{ label: '', value: '' }]).forEach(stat =>
      this.stats.push(
        this.fb.group({
          label: [stat.label],
          value: [stat.value],
        }),
      ),
    );
  }

  reset(): void {
    this.editingId.set(null);
    this.thumbnailFile = null;
    this.headerVideoFile = null;
    this.thumbnailPreview.set(null);
    this.headerVideoName.set(null);
    this.form.reset({ published: true });
    this.stats.clear();
    this.addStat();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: SaveBlogRequest = {
      title: this.form.value.title ?? '',
      slug: this.form.value.slug ?? '',
      excerpt: this.form.value.excerpt ?? '',
      content: this.form.value.content ?? '',
      thumbnailFileName: this.thumbnailFile ? null : this.thumbnailPreview(),
      thumbnailFile: this.thumbnailFile,
      headerVideoFileName: this.headerVideoFile ? null : this.headerVideoName(),
      headerVideoFile: this.headerVideoFile,
      tags: this.form.value.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [],
      published: this.form.value.published ?? false,
      publishedAt: this.form.value.publishedAt || null,
      author: this.form.value.author ?? null,
      authorTitle: this.form.value.authorTitle ?? null,
      readTime: this.form.value.readTime ?? null,
      heroQuote: this.form.value.heroQuote ?? null,
      keyPoints: this.form.value.keyPoints?.split('\n').map(k => k.trim()).filter(Boolean) ?? [],
      stats: this.stats.controls
        .map(control => ({
          label: control.value.label ?? '',
          value: control.value.value ?? '',
        }))
        .filter(stat => stat.label || stat.value),
    };

    this.loading.set(true);
    const request$ = this.editingId()
      ? this.api.update(this.editingId()!, payload)
      : this.api.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.show('Blog saved', 'success');
        this.reset();
        this.loadPosts();
      },
      error: () => {
        this.toast.show('Unable to save blog', 'error');
        this.loading.set(false);
      },
    });
  }

  delete(id: string): void {
    this.loading.set(true);
    this.api.delete(id).subscribe({
      next: () => {
        this.toast.show('Blog deleted', 'success');
        this.loadPosts();
      },
      error: () => {
        this.toast.show('Unable to delete blog', 'error');
        this.loading.set(false);
      },
    });
  }

  onThumbnailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.thumbnailFile = file;
    if (file) {
      this.thumbnailPreview.set(URL.createObjectURL(file));
    }
  }

  onHeaderVideoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.headerVideoFile = file;
    if (file) {
      this.headerVideoName.set(file.name);
    }
  }

  onHeroVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.heroVideoFile = file;
    if (file) {
      this.heroVideoName.set(file.name);
      this.headerForm.patchValue({ heroVideoFileName: '' });
    }
  }

  private loadPosts(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: posts => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load blogs', 'error');
        this.loading.set(false);
      },
    });
  }

  private loadHeader(): void {
    this.headerLoading.set(true);
    this.pageApi.fetch().subscribe({
      next: page => {
        this.applyHeader(page);
        this.headerLoading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load blog header', 'error');
        this.headerLoading.set(false);
      },
    });
  }

  private applyHeader(page: BlogPageModel): void {
    this.headerForm.patchValue({
      headerEyebrow: page.headerEyebrow,
      headerTitle: page.headerTitle,
      headerSubtitle: page.headerSubtitle,
      heroVideoFileName: page.heroVideo?.fileName ?? page.heroVideo?.url ?? '',
    });

    this.heroVideoFile = null;
    this.heroVideoName.set(page.heroVideo?.fileName ?? page.heroVideo?.url ?? null);
  }
}
