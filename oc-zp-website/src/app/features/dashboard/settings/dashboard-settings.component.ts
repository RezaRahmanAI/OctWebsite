import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService, ToastService } from '../../../core/services';
import { SiteSettings } from '../../../core/models';

@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.css'],
})
export class DashboardSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SettingsService);
  private readonly toast = inject(ToastService);

  readonly form = this.fb.group({
    siteTitle: ['', Validators.required],
    tagline: [''],
    heroTitle: [''],
    heroSubtitle: [''],
    primaryCtaLabel: ['Get Started'],
    heroImageUrl: [''],
    heroImageAlt: [''],
    heroVideoUrl: [''],
    heroVideoPoster: [''],
    heroMediaBadge: [''],
    heroMediaCaption: [''],
  });

  private settingsId: string | null = null;

  ngOnInit(): void {
    void this.loadSettings();
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: SiteSettings = {
      id: this.settingsId ?? '',
      siteTitle: this.form.value.siteTitle ?? '',
      tagline: this.form.value.tagline ?? '',
      heroTitle: this.form.value.heroTitle ?? '',
      heroSubtitle: this.form.value.heroSubtitle ?? '',
      primaryCtaLabel: this.form.value.primaryCtaLabel ?? '',
      heroImageUrl: this.form.value.heroImageUrl ?? '',
      heroImageAlt: this.form.value.heroImageAlt ?? '',
      heroVideoUrl: this.form.value.heroVideoUrl ?? '',
      heroVideoPoster: this.form.value.heroVideoPoster ?? '',
      heroMediaBadge: this.form.value.heroMediaBadge ?? '',
      heroMediaCaption: this.form.value.heroMediaCaption ?? '',
    };

    try {
      const saved = await this.settingsService.save(payload);
      this.settingsId = saved.id;
      this.toast.show('Settings saved', 'success');
    } catch (error) {
      console.error('Failed to save settings', error);
      this.toast.show('Failed to save settings. Please try again.', 'error');
    }
  }

  private async loadSettings(): Promise<void> {
    const settings = await this.settingsService.ensureLoaded();
    if (settings) {
      this.settingsId = settings.id;
      this.form.patchValue(settings);
    }
  }
}
