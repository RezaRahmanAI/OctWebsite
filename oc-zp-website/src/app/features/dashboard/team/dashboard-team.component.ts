import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService, ToastService } from '../../../core/services';
import { createId } from '../../../core/utils/uuid';

@Component({
  selector: 'app-dashboard-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-team.component.html',
  styleUrls: ['./dashboard-team.component.css'],
})
export class DashboardTeamComponent {
  private readonly fb = inject(FormBuilder);
  private readonly team = inject(TeamService);
  private readonly toast = inject(ToastService);

  readonly members = this.team.members;
  readonly selectedId = signal<string | null>(null);
  readonly isEditing = computed(() => Boolean(this.selectedId()));

  readonly form = this.fb.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    email: ['', [Validators.email]],
    photoUrl: [''],
    bio: [''],
    active: [true],
  });

  select(id: string): void {
    const member = this.team.getById(id);
    if (!member) {
      return;
    }
    this.selectedId.set(id);
    this.form.patchValue({
      name: member.name,
      role: member.role,
      email: member.email ?? '',
      photoUrl: member.photoUrl ?? '',
      bio: member.bio ?? '',
      active: member.active,
    });
  }

  newMember(): void {
    this.selectedId.set(null);
    this.form.reset({ active: true });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    const payload = {
      name: value.name ?? '',
      role: value.role ?? '',
      email: value.email ? value.email : undefined,
      photoUrl: value.photoUrl ? value.photoUrl : undefined,
      bio: value.bio ? value.bio : undefined,
      active: value.active ?? true,
    };
    if (this.selectedId()) {
      this.team.update(this.selectedId()!, payload);
      this.toast.show('Team member updated', 'success');
    } else {
      this.team.create({
        id: createId(),
        ...payload,
      });
      this.toast.show('Team member added', 'success');
    }
    this.newMember();
  }

  delete(id: string): void {
    if (confirm('Delete this team member?')) {
      this.team.delete(id);
      this.toast.show('Team member removed', 'info');
      if (this.selectedId() === id) {
        this.newMember();
      }
    }
  }
}
