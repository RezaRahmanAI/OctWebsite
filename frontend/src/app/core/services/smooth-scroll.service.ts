import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import Lenis from 'lenis';

interface ScrollOptions {
  offset?: number;
  immediate?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private initialized = false;
  private routerSub?: Subscription;
  private lenis?: Lenis;
  private rafId?: number;

  init(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    this.initialized = true;
    this.initializeLenis();
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (fragment) {
          setTimeout(() => this.scrollToSelector(`#${fragment}`, { offset: -80, immediate: true }), 100);
        } else {
          this.scrollToTop();
        }
      });
  }

  scrollToTop(): void {
    this.scrollTo(0, { immediate: true });
  }

  scrollTo(target: number | HTMLElement, options: ScrollOptions = {}): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset: options.offset, immediate: options.immediate });
      return;
    }

    const view = this.document.defaultView;
    if (!view) {
      return;
    }
    const baseTop =
      typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + view.scrollY;
    const finalTop = baseTop + (options.offset ?? 0);
    view.scrollTo({ top: finalTop, behavior: 'auto' });
  }

  scrollToSelector(selector: string, options: ScrollOptions = {}): void {
    const element = this.document.querySelector<HTMLElement>(selector);
    if (element) {
      this.scrollTo(element, options);
    }
  }

  private initializeLenis(): void {
    this.lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      gestureOrientation: 'vertical'
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };

    this.rafId = requestAnimationFrame(raf);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.initialized = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.lenis?.destroy();
  }
}
