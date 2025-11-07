import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router'; // Ensure RouterModule is included here
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import gsap from 'gsap';
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
  animations: [
    trigger('menuReveal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChildren('navLink', { read: ElementRef })
  private navLinkRefs?: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('navCta', { read: ElementRef })
  private navCtaRefs?: QueryList<ElementRef<HTMLElement>>;

  private navContext?: gsap.Context;

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

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.smoothScroll.init();

    queueMicrotask(() => {
      const navLinkEls = this.navLinkRefs ? this.navLinkRefs.toArray().map(link => link.nativeElement) : [];
      const navCtaEls = this.navCtaRefs ? this.navCtaRefs.toArray().map(cta => cta.nativeElement) : [];
      const elements = [...navLinkEls, ...navCtaEls];
      if (!elements.length) {
        return;
      }
      this.navContext = gsap.context(() => {
        gsap.from(elements, {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.navContext?.revert();
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
