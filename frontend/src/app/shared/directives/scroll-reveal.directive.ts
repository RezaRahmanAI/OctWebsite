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

  private tween?: any;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const gsap = getGsap();
    if (!gsap) {
      console.warn('GSAP is not available for scroll animations.');
      return;
    }

    const ScrollTrigger = getScrollTrigger();
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    this.tween = gsap.from(this.elementRef.nativeElement, {
      opacity: 0,
      y: this.revealOffset,
      duration: 1,
      delay: this.revealDelay,
      ease: 'power3.out',
      stagger: this.revealStagger,
      scrollTrigger: {
        trigger: this.elementRef.nativeElement,
        start: 'top 78%',
        once: false,
        toggleActions: 'play none none reverse',
      },
    });
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill?.();
    this.tween?.kill?.();
  }
}
