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

  readonly stats = [
    { value: '120+', label: 'Projects shipped' },
    { value: '8', label: 'Product verticals' },
    { value: '3', label: 'Signature tracks' },
  ];

  readonly faqs = [
    {
      question: 'How does the services + academy partnership work?',
      answer: 'Client engagements inform the academy curriculum. Our delivery squads share playbooks, and learners support internal prototypes before joining client teams.',
    },
    {
      question: 'Can we migrate to your future .NET Core API?',
      answer: 'Absolutely. This Angular app uses a repository pattern so we can swap in an HttpClient provider when the backend goes live.',
    },
    {
      question: 'Do academy graduates join client teams?',
      answer: 'Yes. We mentor learners into apprenticeships that transition to ObjectCanvas projects or partner companies.',
    },
  ];
}
