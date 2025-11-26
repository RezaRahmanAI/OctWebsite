import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../core/services';
import { SaveServiceItemRequest, ServicesApiService } from '../../core/services/services-api.service';
import { ServiceItem } from '../../core/models';

@Component({
  selector: 'app-service-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class ServiceAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ServicesApiService);
  private readonly toast = inject(ToastService);

  readonly services = signal<ServiceItem[]>([]);
  readonly editingId = signal<string | null>(null);
  readonly loading = signal(false);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    summary: ['', Validators.required],
    icon: [''],
    features: ['', Validators.required],
    active: [true],
  });

  ngOnInit(): void {
    this.refresh();
  }

  edit(service: ServiceItem): void {
    this.editingId.set(service.id);
    this.form.setValue({
      title: service.title,
      slug: service.slug,
      summary: service.summary,
      icon: service.icon ?? '',
      features: service.features.join('\n'),
      active: service.active,
    });
  }

  reset(): void {
    this.editingId.set(null);
    this.form.reset({ active: true });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const payload: SaveServiceItemRequest = {
      title: this.form.value.title ?? '',
      slug: this.form.value.slug ?? '',
      summary: this.form.value.summary ?? '',
      icon: this.form.value.icon || null,
      features: (this.form.value.features ?? '')
        .split(/\n|,/)
        .map(value => value.trim())
        .filter(Boolean),
      active: this.form.value.active ?? false,
    };

    const request$ = this.editingId()
      ? this.api.update(this.editingId()!, payload)
      : this.api.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.show('Service saved', 'success');
        this.reset();
        this.refresh();
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
        this.refresh();
      },
      error: () => {
        this.toast.show('Unable to delete service', 'error');
        this.loading.set(false);
      },
    });
  }

  private refresh(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: items => {
        this.services.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load services', 'error');
        this.loading.set(false);
      },
    });
  }
}
