import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfilePageApiService, ProfilePageModel } from '../../core/services/profile-page-api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly profileApi = inject(ProfilePageApiService);

  readonly page = computed<ProfilePageModel | null>(() => this.profileApi.content());
  readonly stats = computed(() => this.page()?.stats ?? []);
  readonly pillars = computed(() => this.page()?.pillars ?? []);

  ngOnInit(): void {
    this.profileApi.load();
  }

  downloadUrl(): string | null {
    return this.page()?.download?.url ?? null;
  }
}
