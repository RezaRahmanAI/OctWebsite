import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css'],
})
export class StatComponent {
  @Input() value!: number | string;
  @Input() label!: string;
  @Input() description?: string;

  isNumber(value: number | string): value is number {
    return typeof value === 'number';
  }
}
