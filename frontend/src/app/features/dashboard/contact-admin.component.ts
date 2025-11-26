import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactPageApiService, ContactPageModel, SaveContactPageRequest } from '../../core/services/contact-page-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class ContactAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ContactPageApiService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  private heroVideoFile: File | null = null;

  readonly form = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    heroVideoFileName: [''],
    consultationOptions: ['', Validators.required],
    regionalSupport: ['', Validators.required],
    emails: this.fb.array([]),
    formOptions: this.fb.array([]),
    ndaLabel: ['', Validators.required],
    responseTime: ['', Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  get formOptions(): FormArray {
    return this.form.get('formOptions') as FormArray;
  }

  addEmail(value = ''): void {
    this.emails.push(this.fb.control(value, Validators.required));
  }

  removeEmail(index: number): void {
    this.emails.removeAt(index);
  }

  addFormOption(value = ''): void {
    this.formOptions.push(this.fb.control(value, Validators.required));
  }

  removeFormOption(index: number): void {
    this.formOptions.removeAt(index);
  }

  onHeroVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.heroVideoFile = file;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const request = this.toRequest();
    this.api.update(request).subscribe({
      next: (page) => {
        this.apply(page);
        this.toast.show('Contact page saved', 'success');
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Failed to save contact page', 'error');
        this.loading.set(false);
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.fetch().subscribe({
      next: (page) => {
        this.apply(page);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load contact page', 'error');
        this.loading.set(false);
      },
    });
  }

  private apply(page: ContactPageModel): void {
    this.form.patchValue({
      headerEyebrow: page.headerEyebrow,
      headerTitle: page.headerTitle,
      headerSubtitle: page.headerSubtitle,
      heroVideoFileName: page.heroVideo?.fileName ?? '',
      consultationOptions: page.consultationOptions,
      regionalSupport: page.regionalSupport,
      ndaLabel: page.ndaLabel,
      responseTime: page.responseTime,
    });

    this.emails.clear();
    page.emails.forEach(email => this.addEmail(email));

    this.formOptions.clear();
    page.formOptions.forEach(option => this.addFormOption(option));

    this.heroVideoFile = null;
  }

  private toRequest(): SaveContactPageRequest {
    const raw = this.form.value;
    return {
      headerEyebrow: raw.headerEyebrow ?? '',
      headerTitle: raw.headerTitle ?? '',
      headerSubtitle: raw.headerSubtitle ?? '',
      heroVideoFileName: raw.heroVideoFileName || null,
      heroVideoFile: this.heroVideoFile,
      consultationOptions: raw.consultationOptions ?? '',
      regionalSupport: raw.regionalSupport ?? '',
      emails: (raw.emails as string[] | undefined)?.filter(Boolean) ?? [],
      formOptions: (raw.formOptions as string[] | undefined)?.filter(Boolean) ?? [],
      ndaLabel: raw.ndaLabel ?? '',
      responseTime: raw.responseTime ?? '',
    } satisfies SaveContactPageRequest;
  }
}
