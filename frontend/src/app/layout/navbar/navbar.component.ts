import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SmoothScrollService } from '../../core/services'; // Assuming this service path is correct

type NavLink = {
  label: string;
  path: string | string[];
  exact?: boolean;
};

type DropdownItem = {
  title: string;
  href: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private readonly smoothScroll = inject(SmoothScrollService);

  // Mobile menu state (for hamburger menu)
  private _menuOpen = signal(false);
  menuOpen = computed(() => this._menuOpen());

  // Dropdown states for desktop navigation
  // Note: 'Services' keeps its old mega-menu logic from the original component
  private _servicesMenuOpen = signal(false);
  servicesMenuOpen = computed(() => this._servicesMenuOpen());

  private _aboutUsMenuOpen = signal(false);
  aboutUsMenuOpen = computed(() => this._aboutUsMenuOpen());

  private _productMenuOpen = signal(false);
  productMenuOpen = computed(() => this._productMenuOpen());

  private _academyMenuOpen = signal(false);
  academyMenuOpen = computed(() => this._academyMenuOpen());

  // Scroll style state (kept from old component)
  private _scrolled = signal(false);
  scrolled = computed(() => this._scrolled());

  // Navbar hide/show on scroll (kept from old component)
  private _hidden = signal(false);
  hidden = computed(() => this._hidden());
  private lastScrollY = 0;

  // Static links for desktop navigation (excluding dropdowns)
  private _links = signal<NavLink[]>([
    { label: 'Home', path: '/', exact: true },
    { label: 'Blog', path: '/blog', exact: false },
    { label: 'Contact', path: '/contact', exact: true },
  ]);
  navLinks = computed(() => this._links());

  // --- Dropdown Content from React Component ---

  readonly aboutUsItems: DropdownItem[] = [
    { title: 'Company Overview', href: '/about/overview' },
    { title: 'Mission', href: '/about/mission' },
    { title: 'Vision', href: '/about/vision' },
    { title: 'Team Member', href: '/about/team' },
  ];

  readonly servicesCollaboration = [
    { label: 'Team Augmentation', fragment: 'team-augmentation' },
    { label: 'End to End Development', fragment: 'end-to-end-development' },
    { label: 'MVP Services', fragment: 'mvp-services' },
    { label: 'Offshore Development', fragment: 'offshore-office-expansion' },
  ];

  readonly technologies = [
    'JavaScript',
    'C++',
    'C#',
    '.Net',
    'Python',
    'Java',
    'PHP',
    'Golang',
    'Flutter',
  ];
  readonly hiringLinks = [
    { label: 'Hire Developers' },
    { label: 'JavaScript Developers' },
    { label: 'Python Developers' },
    { label: 'Java Developers' },
    { label: 'Golang Developers' },
    { label: '.NET Developers' },
  ];

  readonly productItems: DropdownItem[] = [
    { title: 'Accounting -Inventory', href: '/products/accounting-inventory' },
    { title: 'POS Software', href: '/products/pos-software' },
    { title: 'Real Estate Management', href: '/products/real-estate-management' },
    { title: 'Production Management', href: '/products/production-management' },
    { title: 'Hardware Business', href: '/products/hardware-business' },
    { title: 'Mobile Shop Management', href: '/products/mobile-shop-management' },
    { title: 'Electronics Showroom', href: '/products/electronics-showroom' },
    { title: 'Distribution Management', href: '/products/distribution-management' },
  ];

  readonly academyItems: DropdownItem[] = [
    { title: 'Kids Computing', href: '/academy/kids-computing' },
    { title: 'Zero Programming', href: '/academy/zero-programming' },
    { title: 'Freelancing', href: '/academy/freelancing' },
  ];

  constructor() {
    this.smoothScroll.init();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Close all menus on navigation
        this.closeAllMenus();
      });
  }

  // Mobile menu functions
  toggleMenu(): void {
    this._menuOpen.update((v) => !v);
    if (this._menuOpen()) {
      this.closeAllDropdowns();
    }
  }

  closeMenu(): void {
    this.closeAllMenus();
  }

  // --- Dropdown Management Functions ---

  closeAllDropdowns(): void {
    this._servicesMenuOpen.set(false);
    this._aboutUsMenuOpen.set(false);
    this._productMenuOpen.set(false);
    this._academyMenuOpen.set(false);
  }

  closeAllMenus(): void {
    this._menuOpen.set(false);
    this.closeAllDropdowns();
  }

  // Generic handler for desktop menu toggling to ensure only one is open
  toggleDropdown(menu: 'aboutUs' | 'services' | 'product' | 'academy'): void {
    const currentAbout = this.aboutUsMenuOpen();
    const currentService = this.servicesMenuOpen();
    const currentProduct = this.productMenuOpen();
    const currentAcademy = this.academyMenuOpen();

    this.closeAllDropdowns(); // Close all others first

    switch (menu) {
      case 'aboutUs':
        this._aboutUsMenuOpen.set(!currentAbout);
        break;
      case 'services':
        this._servicesMenuOpen.set(!currentService);
        break;
      case 'product':
        this._productMenuOpen.set(!currentProduct);
        break;
      case 'academy':
        this._academyMenuOpen.set(!currentAcademy);
        break;
    }
  }


  setDropdownOpen(menu: 'aboutUs' | 'services' | 'product' | 'academy', open: boolean): void {
    if (!open) {

      setTimeout(() => {
        switch (menu) {
          case 'aboutUs':
            this._aboutUsMenuOpen.set(false);
            break;
          case 'services':
            this._servicesMenuOpen.set(false);
            break;
          case 'product':
            this._productMenuOpen.set(false);
            break;
          case 'academy':
            this._academyMenuOpen.set(false);
            break;
        }
      }, 50); // Small delay
    } else {
      // Open on hover, close all others
      this.closeAllDropdowns();
      switch (menu) {
        case 'aboutUs':
          this._aboutUsMenuOpen.set(true);
          break;
        case 'services':
          this._servicesMenuOpen.set(true);
          break;
        case 'product':
          this._productMenuOpen.set(true);
          break;
        case 'academy':
          this._academyMenuOpen.set(true);
          break;
      }
    }
  }

  // Scroll listener: blur + hide/show navbar (kept from old component)
  @HostListener('window:scroll')
  onScroll(): void {
    const currentY = window.scrollY || 0;

    // blur / shadow state
    this._scrolled.set(currentY > 8);

    const isScrollingDown = currentY > this.lastScrollY + 4;
    const isScrollingUp = currentY < this.lastScrollY - 4;
    const nearTop = currentY < 16;

    if (nearTop) {
      // Always show at the very top
      this._hidden.set(false);
    } else if (isScrollingDown) {
      // Hide when scrolling down
      this._hidden.set(true);
    } else if (isScrollingUp) {
      // Show when scrolling up
      this._hidden.set(false);
    }

    this.lastScrollY = currentY;
  }

  ngOnInit(): void {
    this.onScroll();
  }
}
