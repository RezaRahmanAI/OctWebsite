import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Faq } from '../../core/models';
import { SaveFaqRequest } from '../../core/services/faqs-api.service';
import { FaqsService } from '../../core/services/faqs.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-faq-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './faq-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class FaqAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly faqsService = inject(FaqsService);
  private readonly toast = inject(ToastService);

  readonly editingId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly faqs = this.faqsService.faqs;

  readonly form = this.fb.group({
    question: ['', Validators.required],
    answer: ['', Validators.required],
    displayOrder: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    void this.faqsService.load();
    this.reset();
  }

  edit(faq: Faq): void {
    this.editingId.set(faq.id);
    this.form.setValue({
      question: faq.question,
      answer: faq.answer,
      displayOrder: faq.displayOrder,
    });
  }

  reset(): void {
    this.editingId.set(null);
    this.form.reset({ question: '', answer: '', displayOrder: this.getNextOrder() });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: SaveFaqRequest = {
      question: this.form.value.question ?? '',
      answer: this.form.value.answer ?? '',
      displayOrder: Number(this.form.value.displayOrder ?? 0),
    };

    this.loading.set(true);
    try {
      if (this.editingId()) {
        await this.faqsService.update(this.editingId()!, request);
        this.toast.show('FAQ updated', 'success');
      } else {
        await this.faqsService.create(request);
        this.toast.show('FAQ created', 'success');
      }
      this.reset();
      await this.faqsService.refresh();
    } catch {
      this.toast.show('Unable to save FAQ', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: string): Promise<void> {
    this.loading.set(true);
    try {
      await this.faqsService.delete(id);
      await this.faqsService.refresh();
      this.toast.show('FAQ deleted', 'success');
    } catch {
      this.toast.show('Unable to delete FAQ', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  trackByFaq(_: number, faq: Faq): string {
    return faq.id;
  }

  private getNextOrder(): number {
    const existing = this.faqs();
    if (!existing || existing.length === 0) {
      return 0;
    }
    const maxOrder = Math.max(...existing.map(faq => faq.displayOrder));
    return maxOrder + 1;
  }
}
