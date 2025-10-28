import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService, ToastService } from '../../../core/services';
import { createId } from '../../../core/utils/uuid';

@Component({
  selector: 'app-dashboard-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-services.component.html',
  styleUrls: ['./dashboard-services.component.css'],
})
export class DashboardServicesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly servicesService = inject(ServicesService);
  private readonly toast = inject(ToastService);

  readonly services = this.servicesService.all;
  readonly selectedId = signal<string | null>(null);
  readonly filter = signal('');
  readonly filtered = computed(() => {
    const term = this.filter().toLowerCase();
    if (!term) {
      return this.services();
    }
    return this.services().filter(service => service.title.toLowerCase().includes(term) || service.summary.toLowerCase().includes(term));
  });

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    summary: ['', Validators.required],
    features: [''],
    active: [true],
  });

  newService(): void {
    this.selectedId.set(null);
    this.form.reset({ active: true, features: '' });
  }

  select(id: string): void {
    const service = this.servicesService.getById(id);
    if (!service) {
      return;
    }
    this.selectedId.set(id);
    this.form.patchValue({
      title: service.title,
      slug: service.slug,
      summary: service.summary,
      features: service.features.join('\n'),
      active: service.active,
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
      summary: value.summary!,
      features: value.features ? value.features.split(/\n|,/).map(f => f.trim()).filter(Boolean) : [],
      active: value.active ?? true,
    };
    if (this.selectedId()) {
      this.servicesService.update(this.selectedId()!, payload);
      this.toast.show('Service updated', 'success');
    } else {
      this.servicesService.create({ id: createId(), icon: undefined, ...payload });
      this.toast.show('Service created', 'success');
    }
    this.newService();
  }

  delete(id: string): void {
    if (confirm('Delete this service?')) {
      this.servicesService.delete(id);
      this.toast.show('Service deleted', 'info');
      if (this.selectedId() === id) {
        this.newService();
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
