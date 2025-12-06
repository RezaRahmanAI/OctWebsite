import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SmoothScrollService } from '../../../core/services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly smoothScroll = inject(SmoothScrollService);
  isMenuOpen = signal(false);
  isHidden = signal(false);
  atTop = signal(true);
  private lastScroll = 0;

  navItems = [
    { label: 'Home', link: '/' },
    { label: 'About Us', link: '/about' },
    { label: 'Services', link: '/services' },
    { label: 'Product', link: '/product' },
    { label: 'Academy', link: '/academy' },
    { label: 'Blog', link: '/blog' },
    { label: 'Careers', link: '/careers' },
    { label: 'Contact', link: '/contact' },
  ];

  aboutLinks = [
    { label: 'Company Overview', fragment: 'overview' },
    { label: 'Mission', fragment: 'mission' },
    { label: 'Vision', fragment: 'vision' },
    { label: 'Team Member', fragment: 'team' },
  ];

  constructor() {
    this.smoothScroll.init();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const current = window.scrollY;
    this.atTop.set(current < 10);
    if (current > this.lastScroll && current > 120) {
      this.isHidden.set(true);
    } else {
      this.isHidden.set(false);
    }
    this.lastScroll = current;
  }

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }


  navigateToAbout(fragment: string): void {
    this.closeMenu();
    this.router.navigate(['/about'], { fragment }).then(() => {
      setTimeout(() => this.smoothScroll.scrollToSelector(`#${fragment}`, { offset: -80 }), 50);
    });
  }
}
