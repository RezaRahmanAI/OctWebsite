import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type AcademyTrack = {
  title: string;
  description: string;
  modules: string[];
  outcomes: string[];
};

type LearningFormat = {
  label: string;
  detail: string;
};

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.css']
})
export class AcademyComponent {
  // Hardcoded example content (replace this with actual API call if needed)
  private _academyContent = signal<AcademyPageContent>({
    header: {
      eyebrow: 'ZeroProgrammingBD Academy',
      title: 'Learn Technology, Build Careers',
      subtitle: 'Live online courses taught by industry experts. From beginner to professional.',
    },
    tracks: [
      {
        title: 'Full-Stack Web Development',
        description:
          'Become proficient in both front-end and back-end development with hands-on projects.',
        modules: ['HTML & CSS', 'JavaScript & TypeScript', 'Node.js & Express', 'MongoDB & NoSQL'],
        outcomes: [
          'Build full-stack web applications',
          'Learn industry-standard technologies',
          'Understand the fundamentals of web development',
        ],
      },
      {
        title: 'Digital Marketing & SEO',
        description: 'Master the art of online marketing and SEO to grow businesses and websites.',
        modules: ['SEO Basics', 'Content Marketing', 'Google Ads', 'Social Media Marketing'],
        outcomes: [
          'Drive organic traffic with SEO',
          'Develop content strategies',
          'Run successful ad campaigns on Google and social media',
        ],
      },
      {
        title: 'UI/UX Design',
        description:
          'Design user-centric websites and apps that are not only beautiful but functional.',
        modules: [
          'Wireframing & Prototyping',
          'User Research',
          'Usability Testing',
          'Figma & Adobe XD',
        ],
        outcomes: [
          'Create intuitive user interfaces',
          'Enhance user experience through design thinking',
          'Develop high-fidelity prototypes',
        ],
      },
    ],
  });

  readonly tracks: AcademyTrack[] = [
    {
      title: 'Product Leadership',
      description: 'Shape strategy, align stakeholders, and turn insight into delivery-ready roadmaps.',
      modules: ['Outcome-driven product framing', 'Service blueprinting & discovery rituals', 'Data-informed prioritisation'],
      outcomes: ['Confidence leading cross-functional teams', 'Clear storytelling for executives', 'Operating cadence tuned for growth']
    },
    {
      title: 'Modern Engineering',
      description: 'Adopt automation-first engineering practices with ZeroProgramming accelerators.',
      modules: ['Cloud-native architecture patterns', 'Automation pipelines & DevSecOps', 'Observability and SRE practices'],
      outcomes: ['Faster, safer releases', 'Shared standards and reusable assets', 'Telemetry-driven operations']
    },
    {
      title: 'Experience & Growth',
      description: 'Design end-to-end experiences and lifecycle programmes that convert and retain.',
      modules: ['Design systems & accessibility', 'Journey analytics & experimentation', 'Lifecycle automation toolkits'],
      outcomes: ['Consistent, inclusive interfaces', 'Customer journeys measured in real time', 'Growth programmes that scale responsibly']
    }
  ];

  readonly formats: LearningFormat[] = [
    {
      label: 'Embedded coaching',
      detail: 'Our mentors pair with your squads during active delivery to reinforce new capabilities.'
    },
    {
      label: 'Cohort programmes',
      detail: 'Six to eight week experiences with live sessions, labs, and peer collaboration.'
    },
    {
      label: 'Executive briefings',
      detail: 'Concise sessions that equip leaders to sponsor, measure, and sustain transformation.'
    }
  ];
}
