import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

interface TechLogo {
  name: string;
  color: string;
}

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './tech-stack-slider.component.html',
  styleUrl: './tech-stack-slider.component.css',
})
export class TechStackComponent {
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

  row2: TechLogo[] = [
    { name: '.Net', color: 'text-purple-700' },
    { name: 'Azure', color: 'text-blue-600' },
    { name: 'Aws', color: 'text-orange-600' },
    { name: 'Java', color: 'text-orange-500' },
    { name: 'Laravel', color: 'text-red-500' },
    { name: 'Flutter', color: 'text-blue-400' },
    { name: 'Go', color: 'text-cyan-600' },
    { name: 'Spring Boot', color: 'text-green-500' },
  ];

  // Duplicate for seamless loop
  techRow1 = [...this.row1, ...this.row1];
  techRow2 = [...this.row2, ...this.row2];
}
