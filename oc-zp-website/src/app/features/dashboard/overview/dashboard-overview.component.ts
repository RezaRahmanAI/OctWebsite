import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AcademyService, BlogService, LeadsService, ProductsService, ServicesService, TeamService } from '../../../core/services';
import { StatComponent } from '../../../shared/components';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, StatComponent],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css'],
})
export class DashboardOverviewComponent {
  private readonly team = inject(TeamService);
  private readonly services = inject(ServicesService);
  private readonly products = inject(ProductsService);
  private readonly academy = inject(AcademyService);
  private readonly leads = inject(LeadsService);
  private readonly blog = inject(BlogService);

  metrics = [
    { label: 'Team Members', value: () => this.team.count() },
    { label: 'Active Services', value: () => this.services.all().filter(service => service.active).length },
    { label: 'Active Products', value: () => this.products.all().filter(product => product.active).length },
    { label: 'Academy Tracks', value: () => this.academy.all().filter(track => track.active).length },
    { label: 'Published Posts', value: () => this.blog.list().filter(post => post.published).length },
    { label: 'New Leads', value: () => this.leads.count() },
  ];
}
