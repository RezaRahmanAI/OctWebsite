import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AboutService } from '../../../core/services';
import { createId } from '../../../core/utils/uuid';

@Component({
  selector: 'app-dashboard-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-about.component.html',
  styleUrls: ['./dashboard-about.component.css'],
})
export class DashboardAboutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly about = inject(AboutService);

  readonly form = this.fb.group({
    overview: ['', Validators.required],
    mission: ['', Validators.required],
    vision: ['', Validators.required],
  });

  ngOnInit(): void {
    this.populateForm();
  }

  populateForm(): void {
    const overview = this.about.getByKey('overview');
    const mission = this.about.getByKey('mission');
    const vision = this.about.getByKey('vision');
    this.form.patchValue({
      overview: overview?.content ?? '',
      mission: mission?.content ?? '',
      vision: vision?.content ?? '',
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    ['overview', 'mission', 'vision'].forEach(key => {
      const existing = this.about.getByKey(key as 'overview' | 'mission' | 'vision');
      const payload = {
        id: existing?.id ?? createId(),
        key: key as 'overview' | 'mission' | 'vision',
        content: (value as any)[key] as string,
      };
      this.about.upsert(payload);
    });
  }
}
