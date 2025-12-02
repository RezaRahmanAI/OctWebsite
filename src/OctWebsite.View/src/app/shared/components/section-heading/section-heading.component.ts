import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export type SectionHeadingCta = {
  label: string;
  routerLink?: string | any[];
  fragment?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
};

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './section-heading.component.html',
  styleUrls: ['./section-heading.component.css'],
})
export class SectionHeadingComponent {
  @Input() eyebrow?: string;
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() align: 'left' | 'center' = 'left';
  @Input() ctas: SectionHeadingCta[] = [];

  resolveCtaClasses(cta: SectionHeadingCta): string {
    const baseClasses =
      'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white';

    const primaryClasses =
      'bg-primary text-white shadow-lg shadow-primary/30 hover:translate-y-0.5 hover:bg-primary/90';
    const secondaryClasses =
      'border border-slate-200 bg-white text-slate-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md';

    return `${baseClasses} ${cta.variant === 'secondary' ? secondaryClasses : primaryClasses}`;
  }
}
