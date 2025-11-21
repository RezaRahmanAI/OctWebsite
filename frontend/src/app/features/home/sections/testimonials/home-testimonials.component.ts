import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import type { HomeContent, Testimonial } from '../../../../core/models/home-content.model';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-testimonials',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent, ScrollRevealDirective],
  templateUrl: './home-testimonials.component.html',
  styleUrl: './home-testimonials.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeTestimonialsComponent {
  @Input({ required: true }) header!: HomeContent['testimonials']['header'];
  @Input({ required: true }) testimonials!: Testimonial[];

  protected readonly view = signal<'client' | 'student'>('client');
  protected readonly filteredTestimonials = computed(() =>
    this.testimonials.filter((testimonial) => testimonial.type === this.view())
  );

  protected setView(view: 'client' | 'student'): void {
    this.view.set(view);
  }

  protected stars(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index);
  }
}
