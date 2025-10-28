import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import Lenis, { LenisOptions } from 'lenis';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface ScrollOptions {
  offset?: number;
  immediate?: boolean;
}

type LenisInitOptions = LenisOptions & { autoRaf?: boolean };

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly document = inject(DOCUMENT);
  private lenis?: Lenis;
  private rafId?: number;
  private initialized = false;
  private routerSub?: Subscription;

  init(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    this.initialized = true;
    this.zone.runOutsideAngular(() => {
      const options: LenisInitOptions = {
        autoRaf: false,
        duration: 1.1,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      };
      this.lenis = new Lenis(options);

      const raf = (time: number) => {
        this.lenis?.raf(time);
        this.rafId = window.requestAnimationFrame(raf);
      };
      this.rafId = window.requestAnimationFrame(raf);

      this.routerSub = this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => {
          const fragment = this.router.parseUrl(this.router.url).fragment;
          if (fragment) {
            setTimeout(() => this.scrollToSelector(`#${fragment}`, { offset: -80 }), 100);
          } else {
            this.scrollToTop();
          }
        });
    });
  }

  scrollToTop(): void {
    this.scrollTo(0, { immediate: true });
  }

  scrollTo(target: number | HTMLElement, options: ScrollOptions = {}): void {
    if (!this.lenis) {
      this.document.defaultView?.scrollTo({ top: typeof target === 'number' ? target : target.offsetTop, behavior: 'smooth' });
      return;
    }
    this.zone.runOutsideAngular(() => {
      if (typeof target === 'number') {
        this.lenis?.scrollTo(target, {
          offset: options.offset,
          immediate: options.immediate,
        });
      } else {
        this.lenis?.scrollTo(target, {
          offset: options.offset,
          immediate: options.immediate,
        });
      }
    });
  }

  scrollToSelector(selector: string, options: ScrollOptions = {}): void {
    const element = this.document.querySelector<HTMLElement>(selector);
    if (element) {
      this.scrollTo(element, options);
    }
  }
  ngOnDestroy(): void {
    if (this.rafId) {
      this.document.defaultView?.cancelAnimationFrame(this.rafId);
    }
    this.lenis?.destroy();
    this.routerSub?.unsubscribe();
    this.initialized = false;
  }
}
