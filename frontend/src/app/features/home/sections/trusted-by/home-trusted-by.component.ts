import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TechLogo {
  name: string;
  color: string;
}

@Component({
  selector: 'app-home-trusted-by',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-trusted-by.component.html',
  styleUrl: './home-trusted-by.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTrustedByComponent {
  row1: TechLogo[] = [
    { name: 'Go', color: 'text-cyan-600' },
    { name: 'Laravel', color: 'text-red-500' },
    { name: 'React', color: 'text-blue-500' },
    { name: 'PHP', color: 'text-purple-600' },
    { name: 'Spring Boot', color: 'text-green-500' },
    { name: 'Java', color: 'text-orange-500' },
    { name: 'Python', color: 'text-yellow-500' },
    { name: 'Vue.js', color: 'text-green-500' },
  ];

  // Duplicate for seamless loop
  techRow1 = [...this.row1, ...this.row1];
}
