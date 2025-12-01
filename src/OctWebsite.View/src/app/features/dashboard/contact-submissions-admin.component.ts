import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ContactSubmission, ContactSubmissionsApiService } from '../../core/services/contact-submissions-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact-submissions-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-submissions-admin.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSubmissionsAdminComponent implements OnInit {
  private readonly api = inject(ContactSubmissionsApiService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);
  protected readonly submissions = signal<ContactSubmission[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.getRecent().subscribe({
      next: submissions => {
        this.submissions.set(submissions);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load contact submissions', 'error');
        this.loading.set(false);
      },
    });
  }
}
