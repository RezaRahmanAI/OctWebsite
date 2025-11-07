import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type SectionLink = {
  label: string;
  summary: string;
  route: string;
};

type Capability = {
  title: string;
  description: string;
  points: string[];
};

type Principle = {
  title: string;
  detail: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly sectionLinks: SectionLink[] = [
    {
      label: 'Services',
      summary: 'ObjectCanvas experts orchestrate discovery, design, and delivery for complex programmes.',
      route: '/services'
    },
    {
      label: 'Product',
      summary: 'ZeroProgramming accelerators provide ready-to-deploy automation and data fabrics.',
      route: '/product'
    },
    {
      label: 'Academy',
      summary: 'Pair with practitioner mentors to upskill product, engineering, and growth teams.',
      route: '/academy'
    },
    {
      label: 'Blog',
      summary: 'Perspectives on building resilient digital ecosystems and high-performing teams.',
      route: '/blog'
    },
    {
      label: 'Contact',
      summary: 'Shape an engagement model that meets your roadmap, budget, and governance needs.',
      route: '/contact'
    }
  ];

  readonly stats = [
    {
      value: '85+',
      label: 'Products launched',
      description: 'Validated through multi-market delivery sprints and embedded analytics.'
    },
    {
      value: '4.6x',
      label: 'Automation ROI',
      description: 'Average efficiency lift achieved with ZeroProgramming playbooks.'
    },
    {
      value: '40',
      label: 'Mentors on-call',
      description: 'ObjectCanvas practitioners coaching teams through the Academy.'
    }
  ];

  constructor() {
    this.seo.update({
      title: 'ObjectCanvas × ZeroProgrammingBD | Software Solutions & Tech Academy',
      description:
        'ObjectCanvas Studios and ZeroProgrammingBD Academy deliver enterprise software, digital marketing, and live technology education for founders, enterprises, and future makers.',
      keywords:
        'objectcanvas, zeroprogrammingbd, software development Bangladesh, digital marketing, tech academy, angular tailwind lenis',
      canonical: 'https://www.objectcanvas.com'
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      const stats = this.statsPool();
      this.counters?.forEach((counter, index) => {
        const stat = stats[index];
        if (!stat) {
          return;
        }
        counter.nativeElement.setAttribute('data-suffix', stat.suffix ?? '');
        if (stat.decimals != null) {
          counter.nativeElement.setAttribute('data-decimals', String(stat.decimals));
        }
        this.animation.animateCounter(counter.nativeElement, stat.value);
      });
    });
  }

  protected setTestimonialView(view: 'client' | 'student'): void {
    this.testimonialView.set(view);
  }

  private normalizeMediaUrl(url: string | null | undefined): string {
    if (!url) {
      return '';
    }
  ];

  readonly principles: Principle[] = [
    {
      title: 'Outcome clarity',
      detail: 'Every engagement starts with success metrics, governance, and stakeholder alignment.'
    },
    {
      title: 'Integrated teams',
      detail: 'Product strategists, designers, and engineers operate as one fused team with your leaders.'
    },
    {
      title: 'Momentum mindset',
      detail: 'We ship fast, learn faster, and leave behind the capability to keep scaling.'
    }
  ];
}
