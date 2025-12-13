import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfilePageApiService, ProfilePageModel } from '../../core/services/profile-page-api.service';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { SectionHeadingComponent, SectionHeadingCta } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, AssetUrlPipe, SectionHeadingComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly profileApi = inject(ProfilePageApiService);

  readonly page = computed<ProfilePageModel | null>(() => this.profileApi.content());
  readonly stats = computed(() => this.page()?.stats ?? []);
  readonly pillars = computed(() => this.page()?.pillars ?? []);
  readonly heroCtas = computed<SectionHeadingCta[]>(() => [
    {
      label: this.page()?.downloadLabel ?? 'Download profile',
      onClick: () => this.openDownload(),
    },
    {
      label: 'Talk to our team',
      routerLink: '/contact',
      variant: 'secondary',
    },
  ]);

  ngOnInit(): void {
    this.profileApi.load();
  }

  downloadUrl(): string | null {
    return this.page()?.download?.url ?? null;
  }

  openDownload(): void {
    const url = this.downloadUrl();
    if (!url) return;

    window.open(url, '_blank', 'noopener');
  }
}
