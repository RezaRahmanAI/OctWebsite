import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() title!: string;
  @Input() description?: string;
  @Input() badge?: string;
  @Input() icon?: string;
  @Input() link?: string | any[];
  @Input() image?: string;
  @Input() imageAlt?: string;
}
