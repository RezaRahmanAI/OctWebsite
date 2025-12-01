import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcademyFeatureModel, AcademyPageApiService, AcademyPageModel, FreelancingCourseModel, SaveAcademyPageRequest } from '../../core/services/academy-page-api.service';
import { ToastService } from '../../core/services';

@Component({
  selector: 'app-academy-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './academy-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AcademyAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AcademyPageApiService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  private heroVideoFile: File | null = null;

  readonly form = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    intro: ['', Validators.required],
    heroVideoFileName: [''],
    kidsFeatures: this.fb.array([]),
    freelancingCourses: this.fb.array([])
  });

  ngOnInit(): void {
    this.load();
  }

  get kidsFeatures(): FormArray {
    return this.form.get('kidsFeatures') as FormArray;
  }

  get freelancingCourses(): FormArray {
    return this.form.get('freelancingCourses') as FormArray;
  }

  addFeature(feature?: AcademyFeatureModel): void {
    this.kidsFeatures.push(
      this.fb.group({
        title: [feature?.title ?? '', Validators.required],
        description: [feature?.description ?? '', Validators.required],
        icon: [feature?.icon ?? '', Validators.required],
      })
    );
  }

  removeFeature(index: number): void {
    this.kidsFeatures.removeAt(index);
  }

  addCourse(course?: FreelancingCourseModel): void {
    this.freelancingCourses.push(
      this.fb.group({
        title: [course?.title ?? '', Validators.required],
        description: [course?.description ?? '', Validators.required],
        icon: [course?.icon ?? '', Validators.required],
      })
    );
  }

  removeCourse(index: number): void {
    this.freelancingCourses.removeAt(index);
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
        this.toast.show('Academy page saved', 'success');
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to save academy page', 'error');
        this.loading.set(false);
      },
    });
  }

  onHeroVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.heroVideoFile = file;
    this.form.patchValue({ heroVideoFileName: file?.name ?? this.form.value.heroVideoFileName });
  }

  private load(): void {
    this.loading.set(true);
    this.api.fetchPage().subscribe({
      next: page => {
        this.apply(page);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load academy page', 'error');
        this.loading.set(false);
      },
    });
  }

  private apply(page: AcademyPageModel): void {
    this.heroVideoFile = null;
    this.form.patchValue({
      headerEyebrow: page.headerEyebrow,
      headerTitle: page.headerTitle,
      headerSubtitle: page.headerSubtitle,
      intro: page.intro,
      heroVideoFileName: page.heroVideo?.fileName ?? page.heroVideo?.url ?? '',
    });

    this.kidsFeatures.clear();
    page.kidsFeatures.forEach(feature => this.addFeature(feature));

    this.freelancingCourses.clear();
    page.freelancingCourses.forEach(course => this.addCourse(course));
  }

  private toRequest(): SaveAcademyPageRequest {
    const raw = this.form.value;
    return {
      headerEyebrow: raw.headerEyebrow ?? '',
      headerTitle: raw.headerTitle ?? '',
      headerSubtitle: raw.headerSubtitle ?? '',
      intro: raw.intro ?? '',
      heroVideoFileName: raw.heroVideoFileName || null,
      heroVideoFile: this.heroVideoFile,
      kidsFeatures: this.kidsFeatures.controls.map(control => ({
        title: control.value.title ?? '',
        description: control.value.description ?? '',
        icon: control.value.icon ?? '',
      })),
      freelancingCourses: this.freelancingCourses.controls.map(control => ({
        title: control.value.title ?? '',
        description: control.value.description ?? '',
        icon: control.value.icon ?? '',
      })),
    } satisfies SaveAcademyPageRequest;
  }
}
