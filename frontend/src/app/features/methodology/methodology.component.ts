import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import {
  featureMatrix,
  heroHighlights,
  matrixColumns,
  offerings,
  type MatrixFeature,
  type Offering,
} from './methodology.data';

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent],
  templateUrl: './methodology.component.html',
  styleUrls: ['./methodology.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodologyComponent {
  readonly heroHighlights = heroHighlights;
  readonly matrixColumns = matrixColumns;
  readonly featureMatrix: MatrixFeature[] = featureMatrix;
  readonly offerings: Offering[] = offerings;

  trackById(_: number, item: Offering): string {
    return item.id;
  }
}
