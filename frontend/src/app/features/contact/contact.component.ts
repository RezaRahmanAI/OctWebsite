import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ScrollRevealDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  // Header data
  private _header = signal({
    eyebrow: 'Contact Us',
    title: 'Get In Touch',
    subtitle: 'We would love to hear from you.',
  });
  header = computed(() => this._header());

  // Contact form content
  private _contactContent = signal({
    consultationOptions: 'We offer free consultation services tailored to your needs.',
    regionalSupport: 'Our regional offices are available in several locations globally.',
    ndaLabel: 'I agree to the Non-Disclosure Agreement.',
    responseTime: 'We aim to respond within 48 hours.',
  });
  contactContent = computed(() => this._contactContent());

  // Form options for select field
  private _formOptions = signal([
    'Consultation Request',
    'Product Inquiry',
    'General Information',
    'Other',
  ]);
  formOptions = computed(() => this._formOptions());

  // Emails to display
  private _emails = signal(['support@company.com', 'info@company.com', 'sales@company.com']);
  emails = computed(() => this._emails());
}
