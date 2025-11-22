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
import { ServicesService } from '../../core/services/services.service';
import {
  DropdownItem,
  MethodologyLink,
  NavLink,
  NavigationContent,
  ServiceItem,
} from '../../core/models';
import { ContentService } from '../../core/services/content.service';

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
  private readonly servicesService = inject(ServicesService);
  private readonly contentService = inject(ContentService);

  // Scroll thresholds for navbar background
  private readonly SCROLL_ACTIVATE = 120; // when to turn bg/blur on
  private readonly SCROLL_RESET = 40; // when to turn bg/blur off

  // Mobile menu state (for hamburger menu)
  private _menuOpen = signal(false);
  menuOpen = computed(() => this._menuOpen());

  // Dropdown states for desktop navigation
  private _servicesMenuOpen = signal(false);
  servicesMenuOpen = computed(() => this._servicesMenuOpen());

  private _aboutUsMenuOpen = signal(false);
  aboutUsMenuOpen = computed(() => this._aboutUsMenuOpen());

  private _productMenuOpen = signal(false);
  productMenuOpen = computed(() => this._productMenuOpen());

  private _academyMenuOpen = signal(false);
  academyMenuOpen = computed(() => this._academyMenuOpen());

  // Scroll style state
  private _scrolled = signal(false);
  scrolled = computed(() => this._scrolled());

  // Navbar hide/show on scroll
  private _hidden = signal(false);
  hidden = computed(() => this._hidden());
  private lastScrollY = 0;

  private readonly navigation = this.contentService.navigationContent;
  private readonly defaultNavigation = this.contentService.getDefaultNavigation();

  readonly brand = computed(() => this.navigation()?.brand ?? this.defaultNavigation.brand);
  readonly navLinks = computed<NavLink[]>(
    () => this.navigation()?.primaryLinks ?? this.defaultNavigation.primaryLinks
  );
  readonly aboutUsItems = computed<DropdownItem[]>(
    () => this.navigation()?.aboutMenu ?? this.defaultNavigation.aboutMenu
  );
  readonly servicesCollaboration = computed<MethodologyLink[]>(
    () => this.navigation()?.collaborationMenu ?? this.defaultNavigation.collaborationMenu
  );
  readonly technologies = computed<string[]>(
    () => this.navigation()?.technologies ?? this.defaultNavigation.technologies
  );
  readonly hiringLinks = computed(() => this.navigation()?.hiringLinks ?? this.defaultNavigation.hiringLinks);
  readonly productItems = computed<DropdownItem[]>(
    () => this.navigation()?.productMenu ?? this.defaultNavigation.productMenu
  );

  readonly featuredServices = computed<ServiceItem[]>(() => this.servicesService.services().slice(0, 9));

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
  toggleDropdown(menu: 'services'): void {
    const currentService = this.servicesMenuOpen();

    this.closeAllDropdowns(); // Close all others first

    switch (menu) {
      case 'services':
        this._servicesMenuOpen.set(!currentService);
        break;
    }
  }

  setDropdownOpen(menu: 'services', open: boolean): void {
    if (!open) {
      setTimeout(() => {
        switch (menu) {
          case 'services':
            this._servicesMenuOpen.set(false);
            break;
        }
      }, 50); // Small delay
    } else {
      // Open on hover, close all others
      this.closeAllDropdowns();
      switch (menu) {
        case 'services':
          this._servicesMenuOpen.set(true);
          break;
      }
    }
  }

  // Scroll listener: blur + hide/show navbar
  @HostListener('window:scroll')
  onScroll(): void {
    const currentY = window.scrollY || 0;

    // --- Background / blur state with hysteresis ---
    const wasScrolled = this._scrolled();

    if (currentY > this.SCROLL_ACTIVATE && !wasScrolled) {
      // Only activate once we've really scrolled down
      this._scrolled.set(true);
    } else if (currentY < this.SCROLL_RESET && wasScrolled) {
      // Only remove bg when we’re clearly near the top again
      this._scrolled.set(false);
    }
    // Between SCROLL_RESET–SCROLL_ACTIVATE, we keep previous state (no flicker)

    // --- Hide / show navbar ---
    const isScrollingDown = currentY > this.lastScrollY + 10;
    const isScrollingUp = currentY < this.lastScrollY - 10;
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
