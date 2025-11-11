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
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router'; // Ensure RouterModule is included here
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SmoothScrollService } from '../../core/services';

type NavLink = {
  label: string;
  path: string | string[];
  exact?: boolean;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule], // Ensure RouterModule is included here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private readonly smoothScroll = inject(SmoothScrollService);

  // Mobile menu state
  private _menuOpen = signal(false);
  menuOpen = computed(() => this._menuOpen());

  // Scroll style state
  private _scrolled = signal(false);
  scrolled = computed(() => this._scrolled());

  // 🔥 NEW: hidden state
  private _hidden = signal(false);
  hidden = computed(() => this._hidden());

  // Keep track of last scroll position
  private lastScrollY = 0;

  private _links = signal<NavLink[]>([
    { label: 'Home', path: '/', exact: true },
    { label: 'About', path: '/about', exact: true },
    { label: 'Services', path: '/services', exact: false },
    { label: 'Product', path: '/product', exact: false },
    { label: 'Academy', path: '/academy', exact: false },
    { label: 'Blog', path: '/blog', exact: false },
    { label: 'Contact', path: '/contact', exact: true },
  ]);
  navLinks = computed(() => this._links());

  constructor() {
    this.smoothScroll.init();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this._menuOpen.set(false));
  }

  toggleMenu(): void {
    this._menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this._menuOpen.set(false);
  }

  // 👇 Scroll listener: handle blur + hide/show
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
