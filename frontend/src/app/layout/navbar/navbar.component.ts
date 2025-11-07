import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  DestroyRef,
  computed,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router'; // Ensure RouterModule is included here
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  // Mobile menu state
  private _menuOpen = signal(false);
  menuOpen = computed(() => this._menuOpen());

  // Scroll style state
  private _scrolled = signal(false);
  scrolled = computed(() => this._scrolled());

  // Your primary nav items (match your routes config)
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
    // Close the mobile menu after navigation
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

  // Update scrolled state (header blur/shadow)
  @HostListener('window:scroll')
  onScroll(): void {
    // tweak threshold to taste
    this._scrolled.set(window.scrollY > 8);
  }

  // Ensure correct initial scrolled state on first paint
  ngOnInit(): void {
    this.onScroll();
  }
}
