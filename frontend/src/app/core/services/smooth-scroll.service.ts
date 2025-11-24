import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  init(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    this.initialized = true;
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
    const view = this.document.defaultView;
    if (!view) {
      return;
    }
    const baseTop =
      typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + view.scrollY;
    const finalTop = baseTop + (options.offset ?? 0);
    view.scrollTo({ top: finalTop, behavior: options.immediate ? 'auto' : 'smooth' });
  }

  scrollToSelector(selector: string, options: ScrollOptions = {}): void {
    const element = this.document.querySelector<HTMLElement>(selector);
    if (element) {
      this.scrollTo(element, options);
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.initialized = false;
  }
}
