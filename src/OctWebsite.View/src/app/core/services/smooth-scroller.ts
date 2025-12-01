export interface SmoothScrollerOptions {
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  duration?: number;
}

/**
 * Lightweight smooth scrolling helper used as a fallback when the Lenis library
 * is unavailable in environments without npm registry access.
 */
export class SmoothScroller {
  private previousScrollBehavior?: string;

  constructor(private readonly options: SmoothScrollerOptions = {}) {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    this.previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    root.classList.add('lenis', 'lenis-smooth');

    // Touch and wheel smoothing are not configurable here but options are
    // retained to mirror the Lenis API used by the application.
    void this.options;
  }

  raf(_time: number): void {
    // Native smooth scrolling is handled by the browser; no per-frame work
    // is required. The method is kept to satisfy the same interface used in
    // the root component.
  }

  destroy(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.style.scrollBehavior = this.previousScrollBehavior ?? '';
    root.classList.remove('lenis', 'lenis-smooth');
  }
}
