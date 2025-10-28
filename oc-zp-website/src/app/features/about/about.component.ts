import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AboutService, TeamService } from '../../core/services';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  private readonly aboutService = inject(AboutService);
  private readonly teamService = inject(TeamService);

  readonly overview = this.aboutService.overview;
  readonly mission = this.aboutService.mission;
  readonly vision = this.aboutService.vision;
  readonly team = this.teamService.activeMembers;
}
