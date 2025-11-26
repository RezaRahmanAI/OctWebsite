import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceItem } from '../../core/models';
import { SaveServiceRequest, ServicesApiService } from '../../core/services/services-api.service';
import { SaveServicesPageRequest, ServicesPageApiService, ServicesPageModel } from '../../core/services/services-page-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-services-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class ServicesAdminComponent implements OnInit {
  private readonly api = inject(ServicesApiService);
  private readonly servicesPageApi = inject(ServicesPageApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly services = signal<ServiceItem[]>([]);
  readonly editingId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly pageLoading = signal(false);
  readonly pageContent = signal<ServicesPageModel | null>(null);
  readonly backgroundName = signal<string | null>(null);
  readonly headerVideoName = signal<string | null>(null);
  readonly galleryNames = signal<string[]>([]);

  private backgroundFile: File | null = null;
  private headerVideoFile: File | null = null;
  private galleryFiles: File[] = [];
  private heroVideoFile: File | null = null;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    subtitle: [''],
    slug: ['', Validators.required],
    summary: ['', Validators.required],
    description: [''],
    icon: [''],
    features: [''],
    active: [true],
    featured: [false],
  });

  readonly pageForm = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    heroVideoFileName: [''],
  });

  ngOnInit(): void {
    this.loadPage();
    this.load();
  }

  edit(service: ServiceItem): void {
    this.editingId.set(service.id);
    this.backgroundFile = null;
    this.headerVideoFile = null;
    this.galleryFiles = [];
    this.backgroundName.set(service.backgroundImage?.fileName ?? null);
    this.headerVideoName.set(service.headerVideo?.fileName ?? null);
    this.galleryNames.set((service.gallery ?? []).map(media => media.fileName || '').filter(Boolean));

    this.form.setValue({
      title: service.title,
      subtitle: service.subtitle ?? '',
      slug: service.slug,
      summary: service.summary,
      description: service.description ?? '',
      icon: service.icon ?? '',
      features: (service.features || []).join('\n'),
      active: service.active,
      featured: service.featured ?? false,
    });
  }

  reset(): void {
    this.editingId.set(null);
    this.backgroundFile = null;
    this.headerVideoFile = null;
    this.galleryFiles = [];
    this.backgroundName.set(null);
    this.headerVideoName.set(null);
    this.galleryNames.set([]);
    this.form.reset({ active: true, featured: false });
  }

  submitPage(): void {
    if (this.pageForm.invalid) {
      this.pageForm.markAllAsTouched();
      return;
    }

    const request: SaveServicesPageRequest = {
      headerEyebrow: this.pageForm.value.headerEyebrow ?? '',
      headerTitle: this.pageForm.value.headerTitle ?? '',
      headerSubtitle: this.pageForm.value.headerSubtitle ?? '',
      heroVideoFileName: this.pageForm.value.heroVideoFileName || null,
      heroVideoFile: this.heroVideoFile,
    };

    this.pageLoading.set(true);
    this.servicesPageApi.update(request).subscribe({
      next: page => {
        this.applyPage(page);
        this.toast.show('Services page saved', 'success');
        this.pageLoading.set(false);
      },
      error: () => {
        this.toast.show('Unable to save services page', 'error');
        this.pageLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const features = (this.form.value.features ?? '')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    const payload: SaveServiceRequest = {
      title: this.form.value.title ?? '',
      subtitle: this.form.value.subtitle ?? '',
      slug: this.form.value.slug ?? '',
      summary: this.form.value.summary ?? '',
      description: this.form.value.description ?? '',
      icon: this.form.value.icon ?? '',
      backgroundImage: this.backgroundFile,
      backgroundImageFileName: this.backgroundName(),
      headerVideo: this.headerVideoFile,
      headerVideoFileName: this.headerVideoName(),
      additionalImages: this.galleryFiles,
      additionalImageFileNames: this.galleryNames(),
      features,
      active: this.form.value.active ?? false,
      featured: this.form.value.featured ?? false,
    };

    const request$ = this.editingId()
      ? this.api.update(this.editingId()!, payload)
      : this.api.create(payload);

    this.loading.set(true);
    request$.subscribe({
      next: () => {
        this.toast.show('Service saved', 'success');
        this.reset();
        this.load();
      },
      error: () => {
        this.toast.show('Unable to save service', 'error');
        this.loading.set(false);
      },
    });
  }

  delete(id: string): void {
    this.loading.set(true);
    this.api.delete(id).subscribe({
      next: () => {
        this.toast.show('Service deleted', 'success');
        this.load();
      },
      error: () => {
        this.toast.show('Unable to delete service', 'error');
        this.loading.set(false);
      },
    });
  }

  onBackgroundSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.backgroundFile = file;
    this.backgroundName.set(file?.name ?? this.backgroundName());
  }

  onHeaderVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.headerVideoFile = file;
    this.headerVideoName.set(file?.name ?? this.headerVideoName());
  }

  onHeroVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.heroVideoFile = input.files?.[0] ?? null;
    if (this.heroVideoFile) {
      this.pageForm.patchValue({ heroVideoFileName: this.heroVideoFile.name });
    }
  }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.galleryFiles = files;
    if (files.length > 0) {
      this.galleryNames.set(files.map(file => file.name));
    }
  }

  private load(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: services => {
        this.services.set(services);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load services', 'error');
        this.loading.set(false);
      },
    });
  }

  private loadPage(): void {
    this.pageLoading.set(true);
    this.servicesPageApi.fetch().subscribe({
      next: page => {
        this.applyPage(page);
        this.pageLoading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load services page', 'error');
        this.pageLoading.set(false);
      },
    });
  }

  private applyPage(page: ServicesPageModel): void {
    this.pageContent.set(page);
    this.pageForm.patchValue({
      headerEyebrow: page.headerEyebrow,
      headerTitle: page.headerTitle,
      headerSubtitle: page.headerSubtitle,
      heroVideoFileName: page.heroVideo?.fileName ?? '',
    });
    this.heroVideoFile = null;
  }
}
