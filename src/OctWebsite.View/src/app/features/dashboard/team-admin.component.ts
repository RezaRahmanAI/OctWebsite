import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamApiService, SaveTeamMemberRequest } from '../../core/services/team-api.service';
import { TeamMember } from '../../core/models';
import { ToastService } from '../../core/services';

@Component({
  selector: 'app-team-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class TeamAdminComponent implements OnInit {
  private readonly api = inject(TeamApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly members = signal<TeamMember[]>([]);
  readonly editingId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly photoName = signal<string | null>(null);
  private selectedPhoto: File | null = null;

  readonly form = this.fb.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    bio: [''],
    email: ['', Validators.email],
    active: [true],
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.loadMembers();
  }

  edit(member: TeamMember): void {
    this.editingId.set(member.id);
    this.selectedPhoto = null;
    this.photoName.set(member.photoFileName ?? member.photoUrl ?? null);
    this.form.setValue({
      name: member.name,
      role: member.role,
      bio: member.bio ?? '',
      email: member.email ?? '',
      active: member.active,
    });
  }

  reset(): void {
    this.editingId.set(null);
    this.selectedPhoto = null;
    this.photoName.set(null);
    this.form.reset({ active: true });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.editingId() && !this.selectedPhoto) {
      this.toast.show('Please upload a profile photo', 'error');
      return;
    }
    this.loading.set(true);
    const payload: SaveTeamMemberRequest = {
      name: this.form.value.name ?? '',
      role: this.form.value.role ?? '',
      bio: this.form.value.bio ?? '',
      email: this.form.value.email ?? '',
      active: this.form.value.active ?? false,
      photo: this.selectedPhoto,
      photoFileName: this.photoName(),
    };

    const request$ = this.editingId()
      ? this.api.update(this.editingId()!, payload)
      : this.api.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.show('Team member saved', 'success');
        this.reset();
        this.loadMembers();
      },
      error: () => {
        this.toast.show('Unable to save team member', 'error');
        this.loading.set(false);
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedPhoto = file;
    this.photoName.set(file?.name ?? this.photoName());
  }

  delete(id: string): void {
    this.loading.set(true);
    this.api.delete(id).subscribe({
      next: () => {
        this.toast.show('Team member removed', 'success');
        this.loadMembers();
      },
      error: () => {
        this.toast.show('Unable to delete team member', 'error');
        this.loading.set(false);
      },
    });
  }

  private loadMembers(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: members => {
        this.members.set(members);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load team members', 'error');
        this.loading.set(false);
      },
    });
  }
}
