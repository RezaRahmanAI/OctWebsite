import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcademyService, ToastService } from '../../../core/services';
import { createId } from '../../../core/utils/uuid';

@Component({
  selector: 'app-dashboard-academy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-academy.component.html',
  styleUrls: ['./dashboard-academy.component.css'],
})
export class DashboardAcademyComponent {
  private readonly fb = inject(FormBuilder);
  private readonly academyService = inject(AcademyService);
  private readonly toast = inject(ToastService);

  readonly tracks = this.academyService.all;
  readonly selectedId = signal<string | null>(null);
  readonly filter = signal('');
  readonly filtered = computed(() => {
    const term = this.filter().toLowerCase();
    if (!term) {
      return this.tracks();
    }
    return this.tracks().filter(track => track.title.toLowerCase().includes(term));
  });

  readonly form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    ageRange: [''],
    duration: [''],
    priceLabel: [''],
    active: [true],
    levels: this.fb.array([]),
  });

  get levels(): FormArray {
    return this.form.controls.levels as FormArray;
  }

  get levelGroups(): FormGroup[] {
    return this.levels.controls as FormGroup[];
  }

  constructor() {
    this.addLevel();
  }

  addLevel(): void {
    this.levels.push(
      this.fb.group({
        name: ['', Validators.required],
        tools: [''],
        outcomes: [''],
      }),
    );
  }

  removeLevel(index: number): void {
    if (this.levels.length > 1) {
      this.levels.removeAt(index);
    }
  }

  newTrack(): void {
    this.selectedId.set(null);
    this.form.reset({
      title: '',
      slug: '',
      ageRange: '',
      duration: '',
      priceLabel: '',
      active: true,
    });
    this.levels.clear();
    this.addLevel();
  }

  select(id: string): void {
    const track = this.academyService.getById(id);
    if (!track) {
      return;
    }
    this.selectedId.set(id);
    this.form.patchValue({
      title: track.title,
      slug: track.slug,
      ageRange: track.ageRange ?? '',
      duration: track.duration ?? '',
      priceLabel: track.priceLabel ?? '',
      active: track.active,
    });
    this.levels.clear();
    track.levels.forEach(level => {
      this.levels.push(
        this.fb.group({
          name: [level.name, Validators.required],
          tools: [level.tools.join(', ')],
          outcomes: [level.outcomes.join(', ')],
        }),
      );
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const levels = this.levelGroups.map(control => {
      const lvl = control.value as { name: string; tools?: string; outcomes?: string };
      return {
        name: lvl.name,
        tools: lvl.tools ? lvl.tools.split(',').map(t => t.trim()).filter(Boolean) : [],
        outcomes: lvl.outcomes ? lvl.outcomes.split(',').map(o => o.trim()).filter(Boolean) : [],
      };
    });
    const payload = {
      title: value.title ?? '',
      slug: value.slug ?? '',
      ageRange: value.ageRange ?? undefined,
      duration: value.duration ?? undefined,
      priceLabel: value.priceLabel ?? undefined,
      active: value.active ?? true,
      levels,
    };
    if (this.selectedId()) {
      this.academyService.update(this.selectedId()!, payload);
      this.toast.show('Track updated', 'success');
    } else {
      this.academyService.create({ id: createId(), ...payload });
      this.toast.show('Track created', 'success');
    }
    this.newTrack();
  }

  delete(id: string): void {
    if (confirm('Delete this track?')) {
      this.academyService.delete(id);
      this.toast.show('Track deleted', 'info');
      if (this.selectedId() === id) {
        this.newTrack();
      }
    }
  }

  updateSlug(): void {
    const title = this.form.controls.title.value ?? '';
    if (!this.selectedId()) {
      this.form.controls.slug.setValue(this.slugify(title));
    }
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
