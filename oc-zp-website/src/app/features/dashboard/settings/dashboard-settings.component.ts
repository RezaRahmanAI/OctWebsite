import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService, ToastService } from '../../../core/services';

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
  });

  private settingsId: string | null = null;

  ngOnInit(): void {
    const settings = this.settingsService.settings();
    if (settings) {
      this.settingsId = settings.id;
      this.form.patchValue(settings);
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = {
      id: this.settingsId ?? crypto.randomUUID(),
      ...this.form.value,
    };
    this.settingsService.save(payload as any);
    this.settingsId = payload.id;
    this.toast.show('Settings saved', 'success');
  }
}
