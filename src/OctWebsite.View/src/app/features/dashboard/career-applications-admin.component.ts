import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CareersApiService, CareerApplication } from '../../core/services/careers-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-career-applications-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './career-applications-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerApplicationsAdminComponent implements OnInit {
  private readonly api = inject(CareersApiService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);
  protected readonly applications = signal<CareerApplication[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.getApplications().subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load applications', 'error');
        this.loading.set(false);
      },
    });
  }
}
