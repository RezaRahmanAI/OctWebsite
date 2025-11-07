import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AcademyTrack } from '../../models/academy-track.model';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyComponent {
  private readonly api = inject(ApiService);

  readonly tracks = toSignal(this.api.getAcademyTracks(), { initialValue: [] as AcademyTrack[] });

  readonly outcomes = [
    'Mentor-led sprints mapped to real ObjectCanvas client projects',
    'Career studio covering pitching, freelancing, and entrepreneurship',
    'Access to a community of 35K+ makers and hiring partners'
  ];
}
