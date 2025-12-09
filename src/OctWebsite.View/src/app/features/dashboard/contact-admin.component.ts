import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactOfficeModel, ContactPageApiService, ContactPageModel, SaveContactPageRequest } from '../../core/services/contact-page-api.service';
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
  private officeImageFiles: (File | null)[] = [];

  readonly form = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    heroVideoFileName: [''],
    heroMetaLine: ['', Validators.required],
    primaryCtaLabel: ['', Validators.required],
    primaryCtaLink: ['', Validators.required],
    consultationOptions: ['', Validators.required],
    regionalSupport: ['', Validators.required],
    emails: this.fb.array([]),
    formOptions: this.fb.array([]),
    ndaLabel: ['', Validators.required],
    responseTime: ['', Validators.required],
    officesEyebrow: ['', Validators.required],
    officesTitle: ['', Validators.required],
    officesDescription: ['', Validators.required],
    offices: this.fb.array([]),
    mapEmbedUrl: ['', Validators.required],
    mapTitle: ['', Validators.required],
    headquarters: ['', Validators.required],
    businessHours: this.fb.array([]),
    profileDownloadLabel: ['', Validators.required],
    profileDownloadUrl: ['', Validators.required],
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

  get offices(): FormArray {
    return this.form.get('offices') as FormArray;
  }

  get businessHours(): FormArray {
    return this.form.get('businessHours') as FormArray;
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

  addOffice(value?: ContactOfficeModel): void {
    this.offices.push(
      this.fb.group({
        name: [value?.name ?? '', Validators.required],
        headline: [value?.headline ?? '', Validators.required],
        address: [value?.address ?? '', Validators.required],
        imageUrl: [value?.imageUrl ?? '', Validators.required],
      })
    );

    this.officeImageFiles.push(null);
  }

  removeOffice(index: number): void {
    this.offices.removeAt(index);
    this.officeImageFiles.splice(index, 1);
  }

  addBusinessHour(value = ''): void {
    this.businessHours.push(this.fb.control(value, Validators.required));
  }

  removeBusinessHour(index: number): void {
    this.businessHours.removeAt(index);
  }

  onHeroVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.heroVideoFile = file;
  }

  onOfficeImageSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.officeImageFiles[index] = file;
    if (file) {
      (this.offices.at(index) as FormGroup).patchValue({ imageUrl: file.name });
    }
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
      heroMetaLine: page.heroMetaLine,
      primaryCtaLabel: page.primaryCtaLabel,
      primaryCtaLink: page.primaryCtaLink,
      consultationOptions: page.consultationOptions,
      regionalSupport: page.regionalSupport,
      ndaLabel: page.ndaLabel,
      responseTime: page.responseTime,
      officesEyebrow: page.officesEyebrow,
      officesTitle: page.officesTitle,
      officesDescription: page.officesDescription,
      mapEmbedUrl: page.mapEmbedUrl,
      mapTitle: page.mapTitle,
      headquarters: page.headquarters,
      profileDownloadLabel: page.profileDownloadLabel,
      profileDownloadUrl: page.profileDownloadUrl,
    });

    this.emails.clear();
    page.emails.forEach(email => this.addEmail(email));

    this.formOptions.clear();
    page.formOptions.forEach(option => this.addFormOption(option));

    this.offices.clear();
    page.offices.forEach(office => this.addOffice(office));

    this.officeImageFiles = new Array(page.offices.length).fill(null);

    this.businessHours.clear();
    page.businessHours.forEach(hour => this.addBusinessHour(hour));

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
      heroMetaLine: raw.heroMetaLine ?? '',
      primaryCtaLabel: raw.primaryCtaLabel ?? '',
      primaryCtaLink: raw.primaryCtaLink ?? '',
      consultationOptions: raw.consultationOptions ?? '',
      regionalSupport: raw.regionalSupport ?? '',
      emails: (raw.emails as string[] | undefined)?.filter(Boolean) ?? [],
      formOptions: (raw.formOptions as string[] | undefined)?.filter(Boolean) ?? [],
      ndaLabel: raw.ndaLabel ?? '',
      responseTime: raw.responseTime ?? '',
      officesEyebrow: raw.officesEyebrow ?? '',
      officesTitle: raw.officesTitle ?? '',
      officesDescription: raw.officesDescription ?? '',
      offices: (raw.offices as ContactOfficeModel[] | undefined)?.filter(Boolean) ?? [],
      officeImageFiles: this.officeImageFiles,
      officeImageFileNames: (raw.offices as ContactOfficeModel[] | undefined)?.map(office => office?.imageUrl ?? null) ?? [],
      mapEmbedUrl: raw.mapEmbedUrl ?? '',
      mapTitle: raw.mapTitle ?? '',
      headquarters: raw.headquarters ?? '',
      businessHours: (raw.businessHours as string[] | undefined)?.filter(Boolean) ?? [],
      profileDownloadLabel: raw.profileDownloadLabel ?? '',
      profileDownloadUrl: raw.profileDownloadUrl ?? '',
    } satisfies SaveContactPageRequest;
  }
}
