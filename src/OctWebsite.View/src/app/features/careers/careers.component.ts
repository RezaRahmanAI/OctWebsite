import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CareersApiService, CareerApplicationRequest, JobPosting } from '../../core/services/careers-api.service';
import { ToastService } from '../../core/services/toast.service';
import {
  SectionHeadingComponent,
  SectionHeadingCta,
} from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SectionHeadingComponent],
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareersComponent implements OnInit {
  private readonly careersApi = inject(CareersApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly openings = signal<JobPosting[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected selectedCv: File | null = null;

  protected readonly hero = {
    eyebrow: 'Careers',
    title: 'Shape the future with us',
    subtitle:
      "We're looking for curious minds and builders who want to make an impact. Explore our open roles and send us your resume to start the conversation.",
    videoUrl: '',
    metaLine: 'Product · Platform · Academy',
    status: 'Now hiring',
  };

  protected readonly heroCtas: SectionHeadingCta[] = [
    {
      label: 'View open roles',
      onClick: () => this.scrollToOpenings(),
    },
    {
      label: 'Open details form',
      onClick: () => this.openExternalForm(),
      variant: 'secondary',
    },
  ];

  protected readonly featuredJob = {
    title: 'Full Stack .NET Engineer',
    employmentType: 'Full-time',
    location: 'Hybrid · Dhaka, Bangladesh',
    summary:
      'We are looking for an experienced and skilled Full Stack .NET Engineer to join our dynamic development team. The ideal candidate should be proficient in Blazor, .NET Core, and have extensive experience in both backend and frontend technologies.',
    detailsUrl: 'https://forms.gle/x43m62emAj3zhpBo6',
    responsibilities: [
      {
        title: 'Develop and Maintain Applications',
        items: [
          'Design, develop, and maintain robust, scalable applications using .NET Core and Blazor frameworks.',
          'Build responsive and efficient Web APIs to support frontend applications and integrations with third-party systems.',
          'Employ Entity Framework Core for efficient database operations, including data modeling, querying, and optimization.',
          'Apply principles of .NET clean architecture for clear separation of concerns, maintainability, and scalability.',
          'Develop minimal APIs for efficient microservices implementation.',
          'Design intuitive and responsive UI using Blazor for rich client-side experiences.',
        ],
      },
    ],
    education: 'Bachelor’s or Master’s degree in Computer Science, Engineering, or a related field.',
    experience: '2-7 years of experience in full-stack .NET development with a proven track record of designing, implementing, and deploying complex software solutions.',
    preferredSkills: [
      'Strong proficiency in full-stack .NET development, specifically .NET Core.',
      'Proven experience developing interactive web applications using Blazor.',
      'Proficient in modern JavaScript frameworks and CSS libraries.',
      'Solid understanding of MVVM and MVC architecture patterns.',
      'Hands-on experience with Entity Framework Core and proficient database design skills (SQL Server, PostgreSQL).',
      'Expertise in microservices architecture and .NET clean architecture.',
      'Experience building and consuming RESTful Web APIs.',
      'Familiarity with WPF development for desktop applications (optional but preferred).',
      'Knowledge of MAUI for cross-platform application development (optional but advantageous).',
      'Experience with cloud platforms such as AWS or Azure.',
      'Familiarity with CI/CD pipelines and DevOps tools (Azure DevOps, Jenkins, GitHub Actions).',
      'Practical experience with containerization technologies (Docker, Kubernetes).',
    ],
  };

  protected readonly applicationFields = [
    'Name',
    'Gender',
    'Date of Birth',
    'Phone',
    'Email',
    'Nationality',
    'Address',
    'Cover Letter',
    'Attach CV (PDF or DOCX, under 3 MB)',
  ];

  protected readonly applicationForm = this.fb.group({
    jobPostingId: ['', Validators.required],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: [''],
  });

  ngOnInit(): void {
    this.fetchOpenings();
  }

  scrollToOpenings(): void {
    document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' });
  }

  openExternalForm(): void {
    const preferredLink = this.openings()[0]?.detailsUrl || this.featuredJob.detailsUrl;
    if (preferredLink) {
      window.open(preferredLink, '_blank');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCv = input.files[0];
    }
  }

  submit(): void {
    if (this.applicationForm.invalid || !this.selectedCv) {
      this.applicationForm.markAllAsTouched();
      this.error.set('Please complete all required fields and attach your CV.');
      return;
    }

    const request: CareerApplicationRequest = {
      jobPostingId: this.applicationForm.value.jobPostingId ?? '',
      fullName: this.applicationForm.value.fullName ?? '',
      email: this.applicationForm.value.email ?? '',
      phone: this.applicationForm.value.phone ?? '',
      message: this.applicationForm.value.message ?? '',
      cv: this.selectedCv,
    };

    this.submitting.set(true);
    this.error.set(null);

    this.careersApi.submitApplication(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.show('Application submitted! We will be in touch soon.', 'success');
        this.applicationForm.reset({ jobPostingId: this.applicationForm.value.jobPostingId });
        this.selectedCv = null;
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Unable to submit your application right now. Please try again.');
        this.toast.show('Failed to submit application', 'error');
      },
    });
  }

  private fetchOpenings(): void {
    this.loading.set(true);
    this.careersApi.getOpenings().subscribe({
      next: (openings) => {
        this.openings.set(openings);
        this.loading.set(false);
        if (openings.length > 0) {
          this.applicationForm.controls.jobPostingId.setValue(openings[0].id);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load open positions at the moment.');
      },
    });
  }
}
