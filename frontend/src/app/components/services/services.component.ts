import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { ServiceItem } from '../../models/service-item.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  private readonly api = inject(ApiService);

  readonly services = toSignal(this.api.getServices(), { initialValue: [] as ServiceItem[] });

  readonly serviceHighlights = [
    'Discovery to delivery with cross-functional pods',
    'Integrated QA automation, DevOps and observability',
    'Launch and growth playbooks for SaaS, ecommerce, and platforms'
  ];
}
