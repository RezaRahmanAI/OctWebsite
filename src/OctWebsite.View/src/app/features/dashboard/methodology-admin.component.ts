import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MatrixColumnModel,
  MatrixFeatureModel,
  MethodologyPageApiService,
  MethodologyPageModel,
  SaveMethodologyPageRequest,
  StatHighlightModel,
} from '../../core/services/methodology-page-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-methodology-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './methodology-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MethodologyAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(MethodologyPageApiService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  private heroVideoFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    headerEyebrow: this.createStringControl('', Validators.required),
    headerTitle: this.createStringControl('', Validators.required),
    headerSubtitle: this.createStringControl('', Validators.required),
    heroDescription: this.createStringControl('', Validators.required),
    heroVideoFileName: this.createStringControl('', null),
    heroVideoUrl: this.createStringControl('', null),
    heroHighlights: this.fb.array<FormGroup<{ label: FormControl<string>; value: FormControl<string> }>>([]),
    matrixColumns: this.fb.array<FormGroup<{ key: FormControl<string>; label: FormControl<string> }>>([]),
    featureMatrix: this.fb.array<
      FormGroup<{ name: FormControl<string>; appliesTo: FormControl<string> }>
    >([]),
    contactFields: this.fb.array<FormControl<string>>([]),
  });

  ngOnInit(): void {
    this.load();
  }

  get heroHighlights(): FormArray<FormGroup<{ label: FormControl<string>; value: FormControl<string> }>> {
    return this.form.controls.heroHighlights;
  }

  get matrixColumns(): FormArray<FormGroup<{ key: FormControl<string>; label: FormControl<string> }>> {
    return this.form.controls.matrixColumns;
  }

  get featureMatrix(): FormArray<FormGroup<{ name: FormControl<string>; appliesTo: FormControl<string> }>> {
    return this.form.controls.featureMatrix;
  }

  get contactFields(): FormArray<FormControl<string>> {
    return this.form.controls.contactFields;
  }

  addHighlight(highlight?: StatHighlightModel): void {
    this.heroHighlights.push(this.createHighlightGroup(highlight));
  }

  removeHighlight(index: number): void {
    this.heroHighlights.removeAt(index);
  }

  addColumn(column?: MatrixColumnModel): void {
    this.matrixColumns.push(this.createColumnGroup(column));
  }

  removeColumn(index: number): void {
    this.matrixColumns.removeAt(index);
  }

  addFeature(feature?: MatrixFeatureModel): void {
    this.featureMatrix.push(this.createFeatureGroup(feature));
  }

  removeFeature(index: number): void {
    this.featureMatrix.removeAt(index);
  }

  addContactField(value = ''): void {
    this.contactFields.push(this.createStringControl(value));
  }

  removeContactField(index: number): void {
    this.contactFields.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const request = this.toRequest();
    this.api.upsertPage(request).subscribe({
      next: page => {
        this.apply(page);
        this.toast.show('Methodology page saved', 'success');
        this.loading.set(false);
        this.heroVideoFile = null;
      },
      error: () => {
        this.toast.show('Unable to save methodology page', 'error');
        this.loading.set(false);
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.fetchPage().subscribe({
      next: page => {
        this.apply(page);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load methodology page', 'error');
        this.loading.set(false);
      },
    });
  }

  private apply(page: MethodologyPageModel): void {
    this.form.patchValue({
      headerEyebrow: page.headerEyebrow,
      headerTitle: page.headerTitle,
      headerSubtitle: page.headerSubtitle,
      heroDescription: page.heroDescription,
      heroVideoFileName: page.heroVideo?.fileName ?? '',
      heroVideoUrl: page.heroVideo?.url ?? '',
    });

    this.heroVideoFile = null;

    this.heroHighlights.clear();
    page.heroHighlights.forEach(highlight => this.addHighlight(highlight));

    this.matrixColumns.clear();
    page.matrixColumns.forEach(column => this.addColumn(column));

    this.featureMatrix.clear();
    page.featureMatrix.forEach(feature => this.addFeature(feature));

    this.contactFields.clear();
    page.contactFields.forEach(field => this.addContactField(field));
  }

  private toRequest(): SaveMethodologyPageRequest {
    const raw = this.form.getRawValue();
    return {
      headerEyebrow: raw.headerEyebrow ?? '',
      headerTitle: raw.headerTitle ?? '',
      headerSubtitle: raw.headerSubtitle ?? '',
      heroDescription: raw.heroDescription ?? '',
      heroVideoFileName: raw.heroVideoFileName || null,
      heroVideoUrl: raw.heroVideoUrl || null,
      heroVideoFile: this.heroVideoFile,
      heroHighlights: this.heroHighlights.controls.map(control => ({
        label: control.value.label ?? '',
        value: control.value.value ?? '',
      })),
      matrixColumns: this.matrixColumns.controls.map(control => ({
        key: control.value.key ?? '',
        label: control.value.label ?? '',
      })),
      featureMatrix: this.featureMatrix.controls.map(control => ({
        name: control.value.name ?? '',
        appliesTo: (control.value.appliesTo as string)?.split(',').map(value => value.trim()).filter(Boolean) ?? [],
      })),
      contactFields: this.contactFields.controls.map(control => control.value ?? ''),
    } satisfies SaveMethodologyPageRequest;
  }

  onHeroVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;
    this.heroVideoFile = file;

    if (file) {
      this.form.patchValue({ heroVideoFileName: file.name });
    }
  }

  private createHighlightGroup(highlight?: StatHighlightModel): FormGroup<{
    label: FormControl<string>;
    value: FormControl<string>;
  }> {
    return this.fb.nonNullable.group({
      label: [highlight?.label ?? '', Validators.required],
      value: [highlight?.value ?? '', Validators.required],
    });
  }

  private createColumnGroup(column?: MatrixColumnModel): FormGroup<{
    key: FormControl<string>;
    label: FormControl<string>;
  }> {
    return this.fb.nonNullable.group({
      key: [column?.key ?? '', Validators.required],
      label: [column?.label ?? '', Validators.required],
    });
  }

  private createFeatureGroup(feature?: MatrixFeatureModel): FormGroup<{
    name: FormControl<string>;
    appliesTo: FormControl<string>;
  }> {
    return this.fb.nonNullable.group({
      name: [feature?.name ?? '', Validators.required],
      appliesTo: [feature?.appliesTo?.join(', ') ?? '', Validators.required],
    });
  }

  private createStringControl(value = '', validator: ValidatorFn | ValidatorFn[] | null = Validators.required): FormControl<string> {
    return this.fb.nonNullable.control(value, validator ?? undefined);
  }
}
