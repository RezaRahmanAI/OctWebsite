import { Injectable, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollAnimationService implements OnDestroy {
  private observer?: IntersectionObserver;
  private mutationObserver?: MutationObserver;
  private registered = new WeakSet<Element>();
  private initialized = false;

  init(root: HTMLElement): void {
    if (this.initialized) {
      this.refresh(root);
      return;
    }

    this.initialized = true;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add('scroll-animate--visible');
            this.observer?.unobserve(target);
          }
        }
      },
      { threshold: 0.15 }
    );

    this.refresh(root);

    this.mutationObserver = new MutationObserver(() => this.refresh(root));
    this.mutationObserver.observe(root, { childList: true, subtree: true });
  }

  refresh(root: ParentNode): void {
    const sections = root.querySelectorAll<HTMLElement>('section');
    let delayIndex = 0;

    sections.forEach((element) => {
      if (this.registered.has(element)) {
        return;
      }

      this.registered.add(element);
      element.classList.add('scroll-animate');
      const delay = Math.min(delayIndex * 60, 240);
      element.style.setProperty('--scroll-animate-delay', `${delay}ms`);
      delayIndex += 1;
      this.observer?.observe(element);
    });
  }

  destroy(): void {
    this.observer?.disconnect();
    this.mutationObserver?.disconnect();
    this.initialized = false;
    this.registered = new WeakSet<Element>();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
