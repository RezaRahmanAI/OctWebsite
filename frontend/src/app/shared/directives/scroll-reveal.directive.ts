import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { getGsap, getScrollTrigger } from '../animations/gsap-helpers';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input() revealDelay = 0;
  @Input() revealOffset = 60;
  @Input() revealStagger = 0;
  @Input() revealOnce = true;
  @Input() revealScale = 0.98;

  private tween?: any;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.elementRef.nativeElement.style.opacity = '1';
      return;
    }

    const gsap = getGsap();
    if (!gsap) {
      console.warn('GSAP is not available for scroll animations.');
      return;
    }

    const ScrollTrigger = getScrollTrigger();
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const element = this.elementRef.nativeElement;
    element.style.willChange = 'transform, opacity';

    const fromConfig = {
      opacity: 0,
      y: this.revealOffset,
      scale: this.revealScale,
      duration: 0.9,
      delay: this.revealDelay,
      ease: 'power3.out',
      stagger: this.revealStagger,
    };

    this.tween = gsap.from(element, {
      ...fromConfig,
      scrollTrigger: {
        trigger: element,
        start: 'top 82%',
        once: this.revealOnce,
        toggleActions: 'play none none reverse',
      },
    });
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill?.();
    this.tween?.kill?.();
  }
}
