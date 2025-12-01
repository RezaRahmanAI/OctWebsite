import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { AboutPageApiService, AboutPageModel } from '../../core/services/about-page-api.service';
import { TeamApiService } from '../../core/services/team-api.service';
import { TeamMember as TeamMemberModel } from '../../core/models';

interface ValueItem {
  title: string;
  description: string;
  videoUrl?: string | null;
}

interface AboutTeamMember {
  name: string;
  role: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
}

interface TeamSection {
  title: string;
  subtitle: string;
  note?: string | null;
  members: AboutTeamMember[];
}

interface AboutPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
    videoUrl?: string | null;
  };
  intro: string;
  mission: {
    title: string;
    description: string;
    imageUrl?: string | null;
  };
  vision: {
    title: string;
    description: string;
  };
  values: ValueItem[];
  story: {
    title: string;
    description: string;
    imageUrl?: string | null;
  };
  team: TeamSection;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, AssetUrlPipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit, AfterViewInit {
  private readonly aboutApi = inject(AboutPageApiService);
  private readonly teamApi = inject(TeamApiService);

  private readonly teamMembers = signal<AboutTeamMember[]>([]);

  @ViewChild('heroVideo')
  set heroVideoRef(video: ElementRef<HTMLVideoElement> | undefined) {
    this.heroVideo = video;
    this.autoplayVideos();
  }
  private heroVideo?: ElementRef<HTMLVideoElement>;
  @ViewChildren('valueVideo') private valueVideos?: QueryList<ElementRef<HTMLVideoElement>>;

  readonly content = computed<AboutPageContent | null>(() => {
    const model = this.aboutApi.content();
    if (!model) {
      return null;
    }

    return this.mapFromApi(model, this.teamMembers());
  });

  readonly header = computed(
    () =>
      this.content()?.header ?? {
        eyebrow: '',
        title: '',
        subtitle: '',
        videoUrl: null,
      }
  );
  readonly intro = computed(() => this.content()?.intro ?? '');
  readonly mission = computed(
    () =>
      this.content()?.mission ?? {
        title: '',
        description: '',
        imageUrl: null,
      }
  );
  readonly vision = computed(
    () =>
      this.content()?.vision ?? {
        title: '',
        description: '',
      }
  );
  readonly values = computed(() => this.content()?.values ?? []);
  readonly story = computed(
    () =>
      this.content()?.story ?? {
        title: '',
        description: '',
        imageUrl: null,
      }
  );
  readonly team = computed(
    () =>
      this.content()?.team ?? {
        title: '',
        subtitle: '',
        members: [],
      }
  );

  ngOnInit(): void {
    this.aboutApi.load();
    this.teamApi.list().subscribe(team => this.teamMembers.set(this.mapTeamMembers(team)));
  }

  ngAfterViewInit(): void {
    this.autoplayVideos();
    this.valueVideos?.changes.subscribe(() => this.autoplayVideos());
  }

  getInitials(name: string | undefined | null): string {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('');
  }

  private mapFromApi(model: AboutPageModel, members: AboutTeamMember[]): AboutPageContent {
    return {
      header: {
        eyebrow: model.headerEyebrow,
        title: model.headerTitle,
        subtitle: model.headerSubtitle,
        videoUrl: model.heroVideo?.url ?? null,
      },
      intro: model.intro,
      mission: {
        title: model.missionTitle,
        description: model.missionDescription,
        imageUrl: model.missionImage?.url ?? null,
      },
      vision: {
        title: model.visionTitle,
        description: model.visionDescription,
      },
      values: model.values.map((value) => ({
        title: value.title,
        description: value.description,
        videoUrl: value.video?.url ?? null,
      })),
      story: {
        title: model.storyTitle,
        description: model.storyDescription,
        imageUrl: model.storyImage?.url ?? null,
      },
      team: {
        title: model.teamTitle,
        subtitle: model.teamSubtitle,
        note: model.teamNote,
        members,
      },
    };
  }

  private mapTeamMembers(members: TeamMemberModel[]): AboutTeamMember[] {
    if (!members?.length) {
      return [];
    }

    return members.map((member: TeamMemberModel) => ({
      name: member.name,
      role: member.role,
      bio: member.bio,
      email: member.email,
      avatarUrl: member.photoUrl,
    }));
  }

  private autoplayVideos(): void {
    queueMicrotask(() => {
      this.tryAutoplay(this.heroVideo?.nativeElement);
      this.valueVideos?.forEach(video => this.tryAutoplay(video.nativeElement));
    });
  }

  private tryAutoplay(video?: HTMLVideoElement | null): void {
    if (!video) return;

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    if (video.paused) {
      void video.play().catch(() => undefined);
    }
  }
}
