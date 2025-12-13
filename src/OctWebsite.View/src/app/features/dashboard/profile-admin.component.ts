import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfilePageApiService, SaveProfilePageRequest, ProfileStatModel, ProfilePillarModel } from '../../core/services/profile-page-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css'],
})
export class ProfileAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProfilePageApiService);
  private readonly toast = inject(ToastService);

  readonly heroImageName = signal<string | null>(null);
  readonly heroVideoName = signal<string | null>(null);
  readonly downloadFileName = signal<string | null>(null);
  private heroFile: File | null = null;
  private heroVideoFile: File | null = null;
  private downloadFile: File | null = null;

  readonly form = this.fb.group({
    headerEyebrow: ['', Validators.required],
    headerTitle: ['', Validators.required],
    headerSubtitle: ['', Validators.required],
    heroTagline: ['', Validators.required],
    overviewTitle: ['', Validators.required],
    overviewDescription: ['', Validators.required],
    spotlightTitle: ['', Validators.required],
    spotlightDescription: ['', Validators.required],
    spotlightBadge: ['', Validators.required],
    downloadLabel: ['', Validators.required],
    downloadUrl: [''],
    stats: this.fb.array([]),
    pillars: this.fb.array([]),
  });

  get stats(): FormArray {
    return this.form.get('stats') as FormArray;
  }

  get pillars(): FormArray {
    return this.form.get('pillars') as FormArray;
  }

  ngOnInit(): void {
    this.api.fetch().subscribe((page) => {
      this.heroImageName.set(page.heroImage?.fileName ?? null);
      this.heroVideoName.set(page.heroVideo?.fileName ?? null);
      this.downloadFileName.set(page.download?.fileName ?? null);
      this.form.patchValue({
        headerEyebrow: page.headerEyebrow,
        headerTitle: page.headerTitle,
        headerSubtitle: page.headerSubtitle,
        heroTagline: page.heroTagline,
        overviewTitle: page.overviewTitle,
        overviewDescription: page.overviewDescription,
        spotlightTitle: page.spotlightTitle,
        spotlightDescription: page.spotlightDescription,
        spotlightBadge: page.spotlightBadge,
        downloadLabel: page.downloadLabel,
        downloadUrl: page.download?.url ?? '',
      });

      this.resetArray(this.stats, page.stats);
      this.resetArray(this.pillars, page.pillars);
    });

    if (this.stats.length === 0) {
      this.addStat();
    }

    if (this.pillars.length === 0) {
      this.addPillar();
    }
  }

  addStat(value?: ProfileStatModel) {
    this.stats.push(
      this.fb.group({
        label: [value?.label ?? '', Validators.required],
        value: [value?.value ?? '', Validators.required],
        description: [value?.description ?? '', Validators.required],
      })
    );
  }

  removeStat(index: number) {
    this.stats.removeAt(index);
  }

  addPillar(value?: ProfilePillarModel) {
    this.pillars.push(
      this.fb.group({
        title: [value?.title ?? '', Validators.required],
        description: [value?.description ?? '', Validators.required],
        accent: [value?.accent ?? '', Validators.required],
      })
    );
  }

  removePillar(index: number) {
    this.pillars.removeAt(index);
  }

  onHeroSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.heroFile = file;
      this.heroImageName.set(file.name);
    }
  }

  onHeroVideoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.heroVideoFile = file;
      this.heroVideoName.set(file.name);
    }
  }

  onDownloadSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.downloadFile = file;
      this.downloadFileName.set(file.name);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.toast.show('Please fill all required fields.', 'error');
      return;
    }

    const value = this.form.value;
    const request: SaveProfilePageRequest = {
      headerEyebrow: value.headerEyebrow ?? '',
      headerTitle: value.headerTitle ?? '',
      headerSubtitle: value.headerSubtitle ?? '',
      heroTagline: value.heroTagline ?? '',
      overviewTitle: value.overviewTitle ?? '',
      overviewDescription: value.overviewDescription ?? '',
      spotlightTitle: value.spotlightTitle ?? '',
      spotlightDescription: value.spotlightDescription ?? '',
      spotlightBadge: value.spotlightBadge ?? '',
      downloadLabel: value.downloadLabel ?? '',
      downloadUrl: value.downloadUrl ?? '',
      stats: (value.stats ?? []) as ProfileStatModel[],
      pillars: (value.pillars ?? []) as ProfilePillarModel[],
      heroImageFileName: this.heroImageName(),
      heroVideoFileName: this.heroVideoName(),
      downloadFileName: this.downloadFileName(),
      heroImageFile: this.heroFile,
      heroVideoFile: this.heroVideoFile,
      downloadFile: this.downloadFile,
    };

    this.api.update(request).subscribe(() => {
      this.toast.show('Profile page updated successfully.', 'success');
      this.heroFile = null;
      this.downloadFile = null;
    });
  }

  private resetArray(array: FormArray, values: any[]) {
    array.clear();
    values.forEach((value) => {
      if (array === this.stats) {
        this.addStat(value as ProfileStatModel);
      } else {
        this.addPillar(value as ProfilePillarModel);
      }
    });
  }
}
