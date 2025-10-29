import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AcademyService,
  BlogService,
  ServicesService,
  SettingsService,
  ProductsService,
} from '../../core/services';
import {
  CardComponent,
  FaqAccordionComponent,
  HeroSectionComponent,
  SectionHeadingComponent,
  StatComponent,
  TestimonialComponent,
} from '../../shared/components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeroSectionComponent,
    SectionHeadingComponent,
    CardComponent,
    StatComponent,
    TestimonialComponent,
    FaqAccordionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private readonly services = inject(ServicesService);
  private readonly products = inject(ProductsService);
  private readonly academy = inject(AcademyService);
  private readonly blog = inject(BlogService);
  private readonly settings = inject(SettingsService);

  readonly hero = computed(() => this.settings.settings());
  readonly serviceCards = computed(() => this.services.services().slice(0, 4));
  readonly productCards = computed(() => this.products.products().slice(0, 4));
  readonly academyTracks = computed(() => this.academy.tracks().slice(0, 3));
  readonly recentPosts = computed(() => this.blog.posts().slice(0, 3));

  readonly partners = [
    { name: 'VisionMesh', tagline: 'AI Analytics' },
    { name: 'Delta Bank', tagline: 'Fintech Transformation' },
    { name: 'Orbit Health', tagline: 'Telemedicine' },
    { name: 'Freightly', tagline: 'Logistics SaaS' },
    { name: 'Northwind Retail', tagline: 'Omnichannel Commerce' },
    { name: 'Skylark Energy', tagline: 'IoT Operations' },
  ];

  readonly caseStudies = [
    {
      title: 'VisionMesh Computer Vision Platform',
      industry: 'Manufacturing',
      result: 'Cut manual QA time by 62%',
      summary:
        'Computer vision workflows deployed to the edge with adaptive model retraining and ZeroProgramming apprentices embedded alongside senior engineers.',
      link: ['/services', 'software-development'],
    },
    {
      title: 'Delta Bank SME Super App',
      industry: 'Financial Services',
      result: 'Onboarded 40k merchants in 5 months',
      summary:
        'Unified onboarding, lending, and analytics using a secure micro frontend architecture and shared academy squads for support and QA.',
      link: ['/product', 'pos-software'],
    },
    {
      title: 'Orbit Health Telemedicine Network',
      industry: 'Healthcare',
      result: '24/7 triage with 99.9% uptime',
      summary:
        'HIPAA-aligned telemedicine modules built with resilient infrastructure and academy fellows managing the patient success desk.',
      link: ['/services', 'mobile-app-development'],
    },
  ];

  readonly capabilities = [
    {
      title: 'Product Strategy',
      description: 'Design sprints, customer journeys, and growth playbooks align leaders around measurable outcomes.',
    },
    {
      title: 'Experience Design',
      description: 'Human-centered research, brand systems, and accessible UI for B2B and B2C experiences.',
    },
    {
      title: 'Modern Engineering',
      description: 'Cloud-native, event-driven, and AI-assisted delivery with automated quality gates.',
    },
    {
      title: 'Enablement & Academy',
      description: 'Upskill your teams with ZeroProgrammingBD academies tailored to live delivery contexts.',
    },
  ];

  readonly process = [
    {
      title: 'Discover & Align',
      detail: 'Collaborative workshops capture your product vision, success metrics, and constraints.',
    },
    {
      title: 'Co-create & Prototype',
      detail: 'Design and engineering pair with academy fellows to ship high-impact slices every sprint.',
    },
    {
      title: 'Launch & Scale',
      detail: 'DevOps automation, analytics, and change management ensure confident releases.',
    },
    {
      title: 'Enable & Evolve',
      detail: 'We hand off documentation, training, and academy graduates who can join your team.',
    },
  ];

  readonly techStack = [
    'Angular',
    'NestJS',
    'Next.js',
    'Azure',
    'AWS',
    'GCP',
    'TensorFlow',
    'Power BI',
    'Figma',
    'Firebase',
    'Supabase',
    'Docker',
  ];

  readonly stats = [
    { value: '120+', label: 'Projects shipped' },
    { value: '8', label: 'Product verticals' },
    { value: '3', label: 'Signature tracks' },
  ];

  readonly faqs = [
    {
      question: 'How does the services + academy partnership work?',
      answer:
        'Client engagements inform the academy curriculum. Our delivery squads share playbooks, and learners support internal prototypes before joining client teams.',
    },
    {
      question: 'Can we migrate to your future .NET Core API?',
      answer:
        'Absolutely. This Angular app uses a repository pattern so we can swap in an HttpClient provider when the backend goes live.',
    },
    {
      question: 'Do academy graduates join client teams?',
      answer:
        'Yes. We mentor learners into apprenticeships that transition to ObjectCanvas projects or partner companies.',
    },
  ];
}
