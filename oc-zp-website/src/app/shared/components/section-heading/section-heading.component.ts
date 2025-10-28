import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-heading.component.html',
  styleUrls: ['./section-heading.component.css'],
})
export class SectionHeadingComponent {
  @Input() eyebrow?: string;
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() align: 'left' | 'center' = 'left';
}
