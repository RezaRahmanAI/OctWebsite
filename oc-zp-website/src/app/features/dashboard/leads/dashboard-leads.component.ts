import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LeadsService, ToastService } from '../../../core/services';

@Component({
  selector: 'app-dashboard-leads',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard-leads.component.html',
  styleUrls: ['./dashboard-leads.component.css'],
})
export class DashboardLeadsComponent {
  private readonly leadsService = inject(LeadsService);
  private readonly toast = inject(ToastService);

  readonly leads = this.leadsService.leads;

  delete(id: string): void {
    if (confirm('Delete this submission?')) {
      this.leadsService.delete(id);
      this.toast.show('Lead removed', 'info');
    }
  }
}
