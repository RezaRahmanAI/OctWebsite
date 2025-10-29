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
  readonly heroHighlights = [
    { value: '52+', label: 'Hybrid studio experts' },
    { value: '480+', label: 'Academy alumni' },
    { value: '12', label: 'Industries served' },
  ];

  readonly marqueeLoops = [0, 1];

  readonly servicePillars = [
    'Vision-led discovery sprints that unite founders and stakeholders in days.',
    'Experience platforms crafted with modular systems, accessibility, and brand fidelity.',
    'Delivery pods instrumented for observability, automation, and measurable outcomes.',
    'Academy enablement embedded from kickoff so teams graduate ready to scale.',
  ];

  readonly marqueeLoops = [0, 1];

  readonly servicePillars = [
    'Discovery blueprints that align stakeholders in days',
    'Experience design systems tuned for conversion and scale',
    'Engineering pods with automation, QA, and observability built-in',
    'Academy enablement so your internal team grows alongside every release',
  ];

  private readonly serviceIllustrations: Record<string, { image: string; alt: string }> = {
    'software-development': {
      image: '/images/studio-lab.svg',
      alt: 'Screens illustrating the ObjectCanvas delivery studio',
    },
    'website-development': {
      image: '/images/visionmesh.svg',
      alt: 'Component-driven marketing experience mockups',
    },
    'mobile-app-development': {
      image: '/images/orbit-health.svg',
      alt: 'Mobile telemedicine dashboards designed by the hybrid studio',
    },
    'ecommerce-website': {
      image: '/images/product-universe.svg',
      alt: 'Commerce accelerators orbiting the combined platform',
    },
  };

  private readonly productIllustrations: Record<string, { image: string; alt: string }> = {
    'accounting-inventory': {
      image: '/images/delta-bank.svg',
      alt: 'Accounting and inventory insights with automated ledgers',
    },
    'pos-software': {
      image: '/images/hero-collaboration.svg',
      alt: 'Retail command center built by ObjectCanvas and ZeroProgrammingBD',
    },
    'real-estate-management': {
      image: '/images/academy-experience.svg',
      alt: 'Connected real estate workflows with academy-trained analysts',
    },
    'production-management': {
      image: '/images/studio-lab.svg',
      alt: 'Production control room visualizing live manufacturing telemetry',
    },
  };

  readonly serviceCards = computed(() =>
    this.services
      .services()
      .slice(0, 4)
      .map(card => ({
        ...card,
        image: this.serviceIllustrations[card.slug]?.image,
        imageAlt: this.serviceIllustrations[card.slug]?.alt,
      })),
  );

  readonly productCards = computed(() =>
    this.products
      .products()
      .slice(0, 4)
      .map(card => ({
        ...card,
        image: this.productIllustrations[card.slug]?.image,
        imageAlt: this.productIllustrations[card.slug]?.alt,
      })),
  );

  readonly academyTracks = computed(() => this.academy.tracks().slice(0, 3));
  readonly recentPosts = computed(() => this.blog.posts().slice(0, 3));

  readonly partners = [
    { name: 'VisionMesh', tagline: 'Intelligent manufacturing' },
    { name: 'Delta Bank', tagline: 'Fintech transformation' },
    { name: 'Orbit Health', tagline: 'Telemedicine systems' },
    { name: 'Freightly', tagline: 'Logistics SaaS' },
    { name: 'Northwind Retail', tagline: 'Omnichannel commerce' },
    { name: 'Skylark Energy', tagline: 'IoT operations' },
  ];

  readonly caseStudies = [
    {
      title: 'VisionMesh Computer Vision Platform',
      industry: 'Manufacturing',
      result: 'Cut manual QA time by 62%',
      summary:
        'Computer vision workflows deployed to the edge with adaptive model retraining and ZeroProgramming fellows assisting change management.',
      link: ['/services', 'software-development'],
      image: '/images/visionmesh.svg',
      imageAlt: 'VisionMesh adaptive computer vision control center',
    },
    {
      title: 'Delta Bank SME Super App',
      industry: 'Financial Services',
      result: 'Onboarded 40k merchants in 5 months',
      summary:
        'Unified onboarding, lending, and analytics using a secure micro-frontend architecture and shared academy squads for support and QA.',
      link: ['/product', 'pos-software'],
      image: '/images/delta-bank.svg',
      imageAlt: 'Delta Bank SME super app experience overview',
    },
    {
      title: 'Orbit Health Telemedicine Network',
      industry: 'Healthcare',
      result: '24/7 triage with 99.9% uptime',
      summary:
        'HIPAA-aligned telemedicine modules built with resilient infrastructure while academy fellows managed patient success across time zones.',
      link: ['/services', 'mobile-app-development'],
      image: '/images/orbit-health.svg',
      imageAlt: 'Orbit Health telemedicine dashboards and patient triage',
    },
  ];

  readonly fusionHighlights = [
    'Studios choreograph research, design, and engineering so journeys feel intentional.',
    'ZeroProgrammingBD mentors co-create features, keeping delivery and enablement inseparable.',
    'Modern storytelling pairs evidence with emotion to show what your next launch can become.',
  ];

  readonly experienceGallery = [
    {
      image: '/images/studio-lab.svg',
      alt: 'Studio lab dashboards',
      caption: 'Experience-led studios choreograph design, engineering, and strategy in one shared command center.',
    },
    {
      image: '/images/academy-experience.svg',
      alt: 'Academy coaching interface',
      caption: 'ZeroProgrammingBD cohorts learn directly from live delivery data with mentors on call.',
    },
    {
      image: '/images/product-universe.svg',
      alt: 'Product orbit illustration',
      caption: 'Accelerators cover finance, health, and commerce so your product starts with momentum.',
    },
  ];

  readonly primaryExperience = this.experienceGallery[0];
  readonly secondaryExperience = this.experienceGallery.slice(1);

  readonly collaborationMoments = [
    {
      title: 'Immersive discovery',
      detail: 'Blueprint workshops align leaders around journeys, goals, and the data we will instrument from day one.',
    },
    {
      title: 'Launch-ready build',
      detail: 'Cross-functional squads deliver production-grade releases with academy fellows embedded for scale.',
    },
    {
      title: 'Enablement runway',
      detail: 'Mentored graduates join your teams with documentation, tooling, and rituals already mastered.',
    },
  ];

  readonly process = [
    {
      title: 'Discover & Align',
      detail: 'Collaborative rituals capture product vision, success metrics, and technical constraints.',
    },
    {
      title: 'Co-create & Prototype',
      detail: 'Design and engineering ship interactive slices weekly while mentors coach rising talent.',
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

  readonly stats = [
    { value: '120+', label: 'Projects shipped' },
    { value: '8', label: 'Product verticals' },
    { value: '3', label: 'Signature tracks' },
  ];

  readonly faqs = [
    {
      question: 'How does the hybrid ObjectCanvas × ZeroProgrammingBD partnership work?',
      answer:
        'Services and academy squads are staffed together. Learners shadow senior engineers, then contribute to delivery while we embed documentation and handover assets.',
    },
    {
      question: 'Can you integrate with our existing engineering stack?',
      answer:
        'Yes. Our pods work across Angular, React, .NET, Node, and modern cloud platforms—adapting to your tooling while uplifting quality gates and automation.',
    },
    {
      question: 'What happens after launch?',
      answer:
        'We stay close with observability dashboards, release playbooks, and academy graduates ready to join your team or continue iterating with us.',
    },
  ];

  trackIndex(index: number, _loop: number): number {
    return index;
  }
}
