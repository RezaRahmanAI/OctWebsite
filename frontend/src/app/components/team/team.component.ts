import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { TeamMember } from '../../models/team-member.model';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [NgFor],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent {
  private readonly api = inject(ApiService);

  readonly members = toSignal(this.api.getTeam(), { initialValue: [] as TeamMember[] });
}
