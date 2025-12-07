import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  readonly form = this.fb.group({
    heroHighlights: this.fb.array([]),
    matrixColumns: this.fb.array([]),
    featureMatrix: this.fb.array([]),
    contactFields: this.fb.array([])
  });

  ngOnInit(): void {
    this.load();
  }

  get heroHighlights(): FormArray {
    return this.form.get('heroHighlights') as FormArray;
  }

  get matrixColumns(): FormArray {
    return this.form.get('matrixColumns') as FormArray;
  }

  get featureMatrix(): FormArray {
    return this.form.get('featureMatrix') as FormArray;
  }

  get contactFields(): FormArray {
    return this.form.get('contactFields') as FormArray;
  }

  addHighlight(highlight?: StatHighlightModel): void {
    this.heroHighlights.push(
      this.fb.group({
        label: [highlight?.label ?? '', Validators.required],
        value: [highlight?.value ?? '', Validators.required]
      })
    );
  }

  removeHighlight(index: number): void {
    this.heroHighlights.removeAt(index);
  }

  addColumn(column?: MatrixColumnModel): void {
    this.matrixColumns.push(
      this.fb.group({
        key: [column?.key ?? '', Validators.required],
        label: [column?.label ?? '', Validators.required]
      })
    );
  }

  removeColumn(index: number): void {
    this.matrixColumns.removeAt(index);
  }

  addFeature(feature?: MatrixFeatureModel): void {
    this.featureMatrix.push(
      this.fb.group({
        name: [feature?.name ?? '', Validators.required],
        appliesTo: [feature?.appliesTo?.join(', ') ?? '', Validators.required]
      })
    );
  }

  removeFeature(index: number): void {
    this.featureMatrix.removeAt(index);
  }

  addContactField(value = ''): void {
    this.contactFields.push(this.fb.control(value, Validators.required));
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
    const raw = this.form.value;
    return {
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
}
