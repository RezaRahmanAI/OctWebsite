import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../core/services';
import {
  AboutPageApiService,
  AboutPageModel,
  SaveAboutPageRequest,
  SaveAboutValueRequest,
} from '../../core/services/about-page-api.service';

@Component({
  selector: 'app-about-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AboutAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AboutPageApiService);
  private readonly toast = inject(ToastService);

  private heroVideoFile: File | null = null;
  private missionImageFile: File | null = null;
  private storyImageFile: File | null = null;
  private valueVideoFiles: (File | null)[] = [];

  readonly loading = signal(false);
  readonly form = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    heroVideoFileName: [''],
    intro: ['', Validators.required],
    missionTitle: ['', Validators.required],
    missionDescription: ['', Validators.required],
    visionTitle: ['', Validators.required],
    visionDescription: ['', Validators.required],
    missionImageFileName: [''],
    values: this.fb.array([]),
    storyTitle: ['', Validators.required],
    storyDescription: ['', Validators.required],
    storyImageFileName: [''],
    teamTitle: ['', Validators.required],
    teamSubtitle: ['', Validators.required],
    teamNote: [''],
  });

  ngOnInit(): void {
    this.loadPage();
  }

  get values(): FormArray {
    return this.form.get('values') as FormArray;
  }

  addValue(value?: SaveAboutValueRequest): void {
    this.values.push(
      this.fb.group({
        title: [value?.title ?? '', Validators.required],
        description: [value?.description ?? '', Validators.required],
        videoFileName: [value?.videoFileName ?? ''],
      })
    );
    this.valueVideoFiles.push(null);
  }

  removeValue(index: number): void {
    this.values.removeAt(index);
    this.valueVideoFiles.splice(index, 1);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const request = this.toRequest();
    this.api.update(request).subscribe({
      next: page => {
        this.applyPage(page);
        this.toast.show('About page saved', 'success');
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Failed to save About content', 'error');
        this.loading.set(false);
      },
    });
  }

  private loadPage(): void {
    this.loading.set(true);
    this.api.fetch().subscribe({
      next: page => {
        this.applyPage(page);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load About content', 'error');
        this.loading.set(false);
      },
    });
  }

  private applyPage(page: AboutPageModel): void {
    this.form.patchValue({
      headerEyebrow: page.headerEyebrow,
      headerTitle: page.headerTitle,
      headerSubtitle: page.headerSubtitle,
      heroVideoFileName: page.heroVideo?.fileName ?? '',
      intro: page.intro,
      missionTitle: page.missionTitle,
      missionDescription: page.missionDescription,
      visionTitle: page.visionTitle,
      visionDescription: page.visionDescription,
      missionImageFileName: page.missionImage?.fileName ?? '',
      storyTitle: page.storyTitle,
      storyDescription: page.storyDescription,
      storyImageFileName: page.storyImage?.fileName ?? '',
      teamTitle: page.teamTitle,
      teamSubtitle: page.teamSubtitle,
      teamNote: page.teamNote ?? '',
    });

    this.heroVideoFile = null;
    this.missionImageFile = null;
    this.storyImageFile = null;
    this.valueVideoFiles = [];

    this.values.clear();
    page.values.forEach(value =>
      this.addValue({
        title: value.title,
        description: value.description,
        videoFileName: value.video?.fileName ?? value.video?.url ?? undefined,
      })
    );
  }

  onHeroVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.heroVideoFile = file;
  }

  onMissionImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.missionImageFile = file;
  }

  onStoryImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.storyImageFile = file;
  }

  onValueVideoSelected(index: number, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.valueVideoFiles[index] = file;
  }

  private toRequest(): SaveAboutPageRequest {
    const raw = this.form.value;
    return {
      headerEyebrow: raw.headerEyebrow ?? '',
      headerTitle: raw.headerTitle ?? '',
      headerSubtitle: raw.headerSubtitle ?? '',
      heroVideoFileName: raw.heroVideoFileName || null,
      heroVideoFile: this.heroVideoFile,
      intro: raw.intro ?? '',
      missionTitle: raw.missionTitle ?? '',
      missionDescription: raw.missionDescription ?? '',
      visionTitle: raw.visionTitle ?? '',
      visionDescription: raw.visionDescription ?? '',
      missionImageFileName: raw.missionImageFileName || null,
      missionImageFile: this.missionImageFile,
      values: this.values.controls.map((control, index) => ({
        title: control.value.title ?? '',
        description: control.value.description ?? '',
        videoFileName: control.value.videoFileName || null,
        videoFile: this.valueVideoFiles[index] ?? null,
      })),
      storyTitle: raw.storyTitle ?? '',
      storyDescription: raw.storyDescription ?? '',
      storyImageFileName: raw.storyImageFileName || null,
      storyImageFile: this.storyImageFile,
      teamTitle: raw.teamTitle ?? '',
      teamSubtitle: raw.teamSubtitle ?? '',
      teamNote: raw.teamNote || null,
    } satisfies SaveAboutPageRequest;
  }
}
