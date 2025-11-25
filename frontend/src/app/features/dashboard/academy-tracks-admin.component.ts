import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AcademyPageApiService,
  AcademyTrackLevelModel,
  SaveAcademyTrackRequest,
} from '../../core/services/academy-page-api.service';
import { ToastService } from '../../core/services';

@Component({
  selector: 'app-academy-tracks-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './academy-tracks-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AcademyTracksAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AcademyPageApiService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly selectedId = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    ageRange: ['', Validators.required],
    duration: ['', Validators.required],
    priceLabel: [''],
    audience: ['', Validators.required],
    format: ['', Validators.required],
    summary: ['', Validators.required],
    heroVideoFileName: [''],
    heroPosterFileName: [''],
    highlights: this.fb.array<string[]>([]),
    learningOutcomes: this.fb.array<string[]>([]),
    levels: this.fb.array([]),
    admissionSteps: this.fb.array([]),
    callToActionLabel: ['', Validators.required],
    active: [true],
  });

  readonly tracks = this.api.tracks;

  ngOnInit(): void {
    this.reload();
  }

  get highlights(): FormArray {
    return this.form.get('highlights') as FormArray;
  }

  get learningOutcomes(): FormArray {
    return this.form.get('learningOutcomes') as FormArray;
  }

  get levels(): FormArray {
    return this.form.get('levels') as FormArray;
  }

  get admissionSteps(): FormArray {
    return this.form.get('admissionSteps') as FormArray;
  }

  select(id: string): void {
    const track = this.tracks().find(t => t.id === id);
    if (!track) return;

    this.selectedId.set(id);
    this.form.patchValue({
      title: track.title,
      slug: track.slug,
      ageRange: track.ageRange,
      duration: track.duration,
      priceLabel: track.priceLabel,
      audience: track.audience,
      format: track.format,
      summary: track.summary,
      heroVideoFileName: track.heroVideo?.fileName ?? track.heroVideo?.url ?? '',
      heroPosterFileName: track.heroPoster?.fileName ?? track.heroPoster?.url ?? '',
      callToActionLabel: track.callToActionLabel,
      active: track.active,
    });

    this.highlights.clear();
    track.highlights.forEach(item => this.highlights.push(this.fb.control(item)));

    this.learningOutcomes.clear();
    track.learningOutcomes.forEach(item => this.learningOutcomes.push(this.fb.control(item)));

    this.levels.clear();
    track.levels.forEach(level => this.levels.push(this.createLevel(level)));

    this.admissionSteps.clear();
    track.admissionSteps.forEach(step => this.admissionSteps.push(this.createAdmissionStep(step.title, step.description)));
  }

  addHighlight(): void {
    this.highlights.push(this.fb.control('', Validators.required));
  }

  removeHighlight(index: number): void {
    this.highlights.removeAt(index);
  }

  addOutcome(): void {
    this.learningOutcomes.push(this.fb.control('', Validators.required));
  }

  removeOutcome(index: number): void {
    this.learningOutcomes.removeAt(index);
  }

  addLevel(level?: AcademyTrackLevelModel): void {
    this.levels.push(this.createLevel(level));
  }

  removeLevel(index: number): void {
    this.levels.removeAt(index);
  }

  addAdmissionStep(title = '', description = ''): void {
    this.admissionSteps.push(this.createAdmissionStep(title, description));
  }

  removeAdmissionStep(index: number): void {
    this.admissionSteps.removeAt(index);
  }

  resetForm(): void {
    this.selectedId.set(null);
    this.form.reset({ active: true });
    this.highlights.clear();
    this.learningOutcomes.clear();
    this.levels.clear();
    this.admissionSteps.clear();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.toRequest();
    this.loading.set(true);

    const save$ = this.selectedId()
      ? this.api.updateTrack(this.selectedId()!, request)
      : this.api.createTrack(request);

    save$.subscribe({
      next: track => {
        this.toast.show('Track saved', 'success');
        this.loading.set(false);
        this.selectedId.set(track.id);
      },
      error: () => {
        this.toast.show('Unable to save track', 'error');
        this.loading.set(false);
      },
    });
  }

  delete(id: string): void {
    this.loading.set(true);
    this.api.deleteTrack(id).subscribe({
      next: () => {
        this.toast.show('Track deleted', 'success');
        if (this.selectedId() === id) {
          this.resetForm();
        }
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to delete track', 'error');
        this.loading.set(false);
      },
    });
  }

  private reload(): void {
    this.loading.set(true);
    this.api.fetchTracks().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.toast.show('Unable to load tracks', 'error');
        this.loading.set(false);
      },
    });
  }

  private createLevel(level?: AcademyTrackLevelModel) {
    return this.fb.group({
      title: [level?.title ?? '', Validators.required],
      duration: [level?.duration ?? '', Validators.required],
      description: [level?.description ?? '', Validators.required],
      tools: this.fb.array(level?.tools?.map(tool => this.fb.control(tool)) ?? []),
      outcomes: this.fb.array(level?.outcomes?.map(outcome => this.fb.control(outcome)) ?? []),
      project: [level?.project ?? '', Validators.required],
      image: [level?.image ?? '', Validators.required],
    });
  }

  addTool(levelIndex: number): void {
    const tools = (this.levels.at(levelIndex).get('tools') as FormArray);
    tools.push(this.fb.control('', Validators.required));
  }

  removeTool(levelIndex: number, toolIndex: number): void {
    const tools = (this.levels.at(levelIndex).get('tools') as FormArray);
    tools.removeAt(toolIndex);
  }

  addOutcomeToLevel(levelIndex: number): void {
    const outcomes = (this.levels.at(levelIndex).get('outcomes') as FormArray);
    outcomes.push(this.fb.control('', Validators.required));
  }

  removeOutcomeFromLevel(levelIndex: number, outcomeIndex: number): void {
    const outcomes = (this.levels.at(levelIndex).get('outcomes') as FormArray);
    outcomes.removeAt(outcomeIndex);
  }

  private createAdmissionStep(title: string, description: string) {
    return this.fb.group({
      title: [title, Validators.required],
      description: [description, Validators.required],
    });
  }

  private toRequest(): SaveAcademyTrackRequest {
    const raw = this.form.value;
    return {
      title: raw.title ?? '',
      slug: raw.slug ?? '',
      ageRange: raw.ageRange ?? '',
      duration: raw.duration ?? '',
      priceLabel: raw.priceLabel ?? '',
      audience: raw.audience ?? '',
      format: raw.format ?? '',
      summary: raw.summary ?? '',
      heroVideoFileName: raw.heroVideoFileName || null,
      heroPosterFileName: raw.heroPosterFileName || null,
      highlights: this.highlights.controls.map(control => control.value ?? ''),
      learningOutcomes: this.learningOutcomes.controls.map(control => control.value ?? ''),
      levels: this.levels.controls.map(control => ({
        title: control.value.title ?? '',
        duration: control.value.duration ?? '',
        description: control.value.description ?? '',
        tools: (control.get('tools') as FormArray).controls.map(tool => tool.value ?? ''),
        outcomes: (control.get('outcomes') as FormArray).controls.map(outcome => outcome.value ?? ''),
        project: control.value.project ?? '',
        image: control.value.image ?? '',
      })),
      admissionSteps: this.admissionSteps.controls.map(control => ({
        title: control.value.title ?? '',
        description: control.value.description ?? '',
      })),
      callToActionLabel: raw.callToActionLabel ?? '',
      active: !!raw.active,
    } satisfies SaveAcademyTrackRequest;
  }
}
