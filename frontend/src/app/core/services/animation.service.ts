import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export interface ScrollRevealOptions {
  duration?: number;
  y?: number;
  opacity?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
  trigger?: Element | string;
  start?: string;
}

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly contexts = new Map<Element, gsap.Context>();

  constructor() {
    if (this.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  registerReveal(element: Element, options: ScrollRevealOptions = {}): void {
    if (!this.isBrowser || this.contexts.has(element)) {
      return;
    }

    const {
      duration = 0.8,
      y = 40,
      opacity = 0,
      delay = 0,
      stagger,
      once = true,
      trigger,
      start = 'top 80%'
    } = options;

    const context = gsap.context(() => {
      const targets = stagger ? Array.from(element.children) : [element];
      gsap.from(targets, {
        opacity,
        y,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger ?? element,
          start,
          toggleActions: once ? 'play none none none' : 'play none none reverse'
        }
      });
    }, element);

    this.contexts.set(element, context);
  }

  animateCounter(element: Element, endValue: number): void {
    if (!this.isBrowser) {
      return;
    }

    const context = gsap.context(() => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: endValue,
        duration: 2,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%'
        },
        onUpdate: () => {
          const suffix = element.getAttribute('data-suffix') ?? '';
          const decimalsAttr = element.getAttribute('data-decimals');
          const decimals = decimalsAttr ? Number(decimalsAttr) : 0;
          const value = decimals > 0 ? obj.value : Math.round(obj.value);
          const formatted = Number(value).toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });
          element.textContent = `${formatted}${suffix}`;
        }
      });
    }, element);

    this.contexts.set(element, context);
  }

  destroy(element: Element): void {
    const context = this.contexts.get(element);
    context?.revert();
    this.contexts.delete(element);
  }
}
