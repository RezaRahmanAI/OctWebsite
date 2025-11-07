import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SupportCard {
  title: string;
  description: string;
  points: string[];
}

interface OfficeLocation {
  city: string;
  detail: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  readonly hero = {
    eyebrow: 'Contact',
    title: 'Shape your next move with us',
    intro:
      'ObjectCanvas strategists and ZeroProgramming engineers are ready to map the engagement that fits your roadmap, budget, and governance needs.'
  };

  readonly supportCards: SupportCard[] = [
    {
      title: 'Project discovery',
      description: 'Clarify outcomes, success metrics, and delivery rhythm before we start building.',
      points: ['Value and feasibility workshops', 'Solution architecture outline', 'Delivery plan with resourcing options']
    },
    {
      title: 'Platform acceleration',
      description: 'Bring ZeroProgramming automation and data fabrics into your environment with confidence.',
      points: ['Integration and security assessment', 'Custom accelerator configuration', 'Operational readiness checklist']
    },
    {
      title: 'Capability enablement',
      description: 'Launch an Academy cohort or embedded coaching programme tailored to your teams.',
      points: ['Role-based learning paths', 'Mentor pairing and scheduling', 'Measurement plan for adoption']
    }
  ];

  readonly officeLocations: OfficeLocation[] = [
    { city: 'Dhaka', detail: 'Banani, Dhaka 1213 — Product strategy, design, and Academy HQ.' },
    { city: 'Singapore', detail: 'Marina Bay — Regional platform delivery and automation leadership.' },
    { city: 'Remote', detail: 'Distributed specialists supporting clients across APAC, Europe, and North America.' }
  ];

  readonly inquiryTopics = ['Product partnership', 'Automation & platforms', 'Academy programmes', 'Media & speaking', 'Other'];
}
