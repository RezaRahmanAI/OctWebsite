import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService, ToastService } from '../../../core/services';
import { createId } from '../../../core/utils/uuid';

@Component({
  selector: 'app-dashboard-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-products.component.html',
  styleUrls: ['./dashboard-products.component.css'],
})
export class DashboardProductsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly toast = inject(ToastService);

  readonly products = this.productsService.all;
  readonly selectedId = signal<string | null>(null);
  readonly filter = signal('');
  readonly filtered = computed(() => {
    const term = this.filter().toLowerCase();
    if (!term) {
      return this.products();
    }
    return this.products().filter(product => product.title.toLowerCase().includes(term));
  });

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    summary: ['', Validators.required],
    features: [''],
    active: [true],
  });

  newProduct(): void {
    this.selectedId.set(null);
    this.form.reset({ active: true, features: '' });
  }

  select(id: string): void {
    const product = this.productsService.getById(id);
    if (!product) {
      return;
    }
    this.selectedId.set(id);
    this.form.patchValue({
      title: product.title,
      slug: product.slug,
      summary: product.summary,
      features: product.features.join('\n'),
      active: product.active,
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
      this.productsService.update(this.selectedId()!, payload);
      this.toast.show('Product updated', 'success');
    } else {
      this.productsService.create({ id: createId(), icon: undefined, ...payload });
      this.toast.show('Product created', 'success');
    }
    this.newProduct();
  }

  delete(id: string): void {
    if (confirm('Delete this product?')) {
      this.productsService.delete(id);
      this.toast.show('Product deleted', 'info');
      if (this.selectedId() === id) {
        this.newProduct();
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
