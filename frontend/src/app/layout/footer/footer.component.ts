import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly socialLinks = [
    { label: 'LinkedIn', url: '' },
    { label: 'Facebook', url: '' },
    { label: 'Twitter', url: '' },
    { label: 'Instagram', url: '' },
    { label: 'YouTube', url: '' },
    { label: 'GitHub', url: '' }
  ];
}
