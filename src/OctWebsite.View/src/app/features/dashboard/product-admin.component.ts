import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductItem } from '../../core/models';
import { ProductsService } from '../../core/services/products.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class ProductAdminComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly products = this.productsService.all;
  readonly loading = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    summary: ['', Validators.required],
    icon: ['', Validators.required],
    features: [''],
    active: [true],
  });

  ngOnInit(): void {
    void this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.loading.set(true);
    try {
      await this.productsService.refresh();
    } catch (error) {
      console.error('Unable to load products', error);
      this.toast.show('Unable to load products', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  edit(product: ProductItem): void {
    this.editingId.set(product.id);
    this.form.setValue({
      title: product.title,
      slug: product.slug,
      summary: product.summary,
      icon: product.icon ?? '',
      features: (product.features || []).join('\n'),
      active: product.active,
    });
  }

  reset(): void {
    this.editingId.set(null);
    this.form.reset({ active: true });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.form.value.title ?? '',
      slug: this.form.value.slug ?? '',
      summary: this.form.value.summary ?? '',
      icon: this.form.value.icon ?? '',
      features: (this.form.value.features || '')
        .split('\n')
        .map(feature => feature.trim())
        .filter(Boolean),
      active: this.form.value.active ?? false,
    };

    this.loading.set(true);

    try {
      if (this.editingId()) {
        await this.productsService.update(this.editingId()!, payload);
      } else {
        await this.productsService.create(payload);
      }
      this.toast.show('Product saved', 'success');
      this.reset();
      await this.loadProducts();
    } catch (error) {
      console.error('Unable to save product', error);
      this.toast.show('Unable to save product', 'error');
      this.loading.set(false);
    }
  }

  async delete(id: string): Promise<void> {
    this.loading.set(true);
    try {
      await this.productsService.delete(id);
      this.toast.show('Product deleted', 'success');
      await this.loadProducts();
    } catch (error) {
      console.error('Unable to delete product', error);
      this.toast.show('Unable to delete product', 'error');
      this.loading.set(false);
    }
  }
}
