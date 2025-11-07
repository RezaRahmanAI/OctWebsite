import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';

interface NavLink {
  label: string;
  target: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly links: NavLink[] = [
    { label: 'Solutions', target: 'solutions' },
    { label: 'Products', target: 'products' },
    { label: 'Academy', target: 'academy' },
    { label: 'Process', target: 'process' },
    { label: 'Team', target: 'team' },
    { label: 'Insights', target: 'insights' },
    { label: 'Partner with us', target: 'contact' }
  ];

  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 24);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  navigate(target: string): void {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.isMenuOpen.set(false);
  }
}
