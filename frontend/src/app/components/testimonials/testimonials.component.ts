import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  focus: 'services' | 'academy';
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsComponent {
  readonly testimonials: Testimonial[] = [
    {
      name: 'Farzana Ahmed',
      role: 'COO, Bangladesh Angels',
      quote:
        'ObjectCanvas engineered our deal-flow platform in record time while transferring the exact workflow automations to our internal operations team. It felt like gaining a product squad and a training arm simultaneously.',
      focus: 'services'
    },
    {
      name: 'Mahdiul Islam',
      role: 'Founder, StarterHive',
      quote:
        'ZeroProgramming mentors coached our team from zero to launch-ready no-code apps. Their career studio helped two of our interns land global freelancing contracts before graduation.',
      focus: 'academy'
    },
    {
      name: 'Nusrat Jahan',
      role: 'Head of Digital, Apex Holdings',
      quote:
        'We partnered for an ecommerce re-platform and were blown away by the governance. Weekly insights, CRO experiments, and a curriculum that onboarded our merchandising team into automation-first thinking.',
      focus: 'services'
    }
  ];
}
