import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import {
  MethodologyPageApiService,
  MethodologyPageModel,
  MethodologyOfferingModel,
  MatrixColumnModel,
  MatrixFeatureModel,
  StatHighlightModel,
} from '../../core/services/methodology-page-api.service';

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent],
  templateUrl: './methodology.component.html',
  styleUrls: ['./methodology.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodologyComponent implements OnInit {
  private readonly api = inject(MethodologyPageApiService);

  readonly page = signal<MethodologyPageModel | null>(null);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.api.fetchPage().subscribe({
      next: page => {
        this.page.set(page);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get heroHighlights(): StatHighlightModel[] {
    return this.page()?.heroHighlights ?? [];
  }

  get matrixColumns(): MatrixColumnModel[] {
    return this.page()?.matrixColumns ?? [];
  }

  get featureMatrix(): MatrixFeatureModel[] {
    return this.page()?.featureMatrix ?? [];
  }

  get offerings(): MethodologyOfferingModel[] {
    return this.page()?.offerings ?? [];
  }

  trackById(_: number, item: MethodologyOfferingModel): string {
    return item.id;
  }
}
