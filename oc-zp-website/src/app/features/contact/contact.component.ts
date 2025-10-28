import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LeadsService, ToastService } from '../../core/services';
import { createId } from '../../core/utils/uuid';
import { LeadFormComponent, LeadFormValue, SectionHeadingComponent } from '../../shared/components';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent, LeadFormComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  private readonly leadsService = inject(LeadsService);
  private readonly toast = inject(ToastService);

  submit(value: LeadFormValue): void {
    this.leadsService.create({
      id: createId(),
      name: value.name,
      email: value.email,
      phone: value.phone,
      subject: value.subject,
      message: value.message,
      createdAt: new Date().toISOString(),
    });
    this.toast.show('Thanks! We will reach out soon.', 'success');
  }
}
