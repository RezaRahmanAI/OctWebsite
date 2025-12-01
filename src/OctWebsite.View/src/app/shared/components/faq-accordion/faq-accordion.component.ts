import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

export interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.css'],
})
export class FaqAccordionComponent {
  @Input() items: FaqItem[] = [];
  private expandedIndex = signal<number | null>(0);

  toggle(index: number): void {
    this.expandedIndex.update(current => (current === index ? null : index));
  }

  isExpanded(index: number): boolean {
    return this.expandedIndex() === index;
  }
}
