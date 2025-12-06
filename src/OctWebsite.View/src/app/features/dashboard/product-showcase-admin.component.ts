import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductShowcaseService } from '../../core/services';
import { ProductShowcaseItem } from '../../core/models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-product-showcase-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-showcase-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class ProductShowcaseAdminComponent implements OnInit {
  private readonly showcaseService = inject(ProductShowcaseService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly products = this.showcaseService.products;
  readonly loading = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: ['', Validators.required],
    backgroundColor: ['', Validators.required],
    projectScreenshotUrl: ['', Validators.required],
    highlights: [''],
  });

  ngOnInit(): void {
    void this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.loading.set(true);
    try {
      await this.showcaseService.refresh();
    } catch (error) {
      console.error('Unable to load showcase products', error);
      this.toast.show('Unable to load showcase products', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  edit(product: ProductShowcaseItem): void {
    this.editingId.set(product.id);
    this.form.setValue({
      name: product.name,
      slug: product.slug,
      description: product.description,
      imageUrl: product.imageUrl,
      backgroundColor: product.backgroundColor,
      projectScreenshotUrl: product.projectScreenshotUrl,
      highlights: product.highlights.join('\n'),
    });
  }

  reset(): void {
    this.editingId.set(null);
    this.form.reset();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.form.value.name ?? '',
      slug: this.form.value.slug ?? '',
      description: this.form.value.description ?? '',
      imageUrl: this.form.value.imageUrl ?? '',
      backgroundColor: this.form.value.backgroundColor ?? '',
      projectScreenshotUrl: this.form.value.projectScreenshotUrl ?? '',
      highlights: (this.form.value.highlights || '')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean),
    };

    this.loading.set(true);

    try {
      if (this.editingId()) {
        await this.showcaseService.update(this.editingId()!, payload);
      } else {
        await this.showcaseService.create(payload);
      }
      this.toast.show('Showcase product saved', 'success');
      this.reset();
      await this.loadProducts();
    } catch (error) {
      console.error('Unable to save showcase product', error);
      this.toast.show('Unable to save showcase product', 'error');
      this.loading.set(false);
    }
  }

  async delete(id: string): Promise<void> {
    this.loading.set(true);
    try {
      await this.showcaseService.delete(id);
      this.toast.show('Showcase product deleted', 'success');
      await this.loadProducts();
    } catch (error) {
      console.error('Unable to delete showcase product', error);
      this.toast.show('Unable to delete showcase product', 'error');
      this.loading.set(false);
    }
  }
}
