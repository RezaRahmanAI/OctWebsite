import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { AnimationService, ScrollRevealOptions } from '../../core/services/animation.service';

@Directive({
  selector: '[scrollTo]',
  standalone: true,
})
export class ScrollToDirective {
  @Input('scrollTo') target?: string;
  @Input() scrollOffset = -80;

  constructor(private readonly smoothScroll: SmoothScrollService) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (!this.target) {
      return;
    }
    event.preventDefault();
    this.smoothScroll.scrollToSelector(
      this.target.startsWith('#') ? this.target : `#${this.target}`,
      {
        offset: this.scrollOffset,
      }
    );
  }
}

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private revealOptions: ScrollRevealOptions = {};
  private registered = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly animation: AnimationService
  ) {}

  @Input('appScrollReveal')
  set options(options: ScrollRevealOptions | '' | undefined) {
    if (!options || typeof options === 'string') {
      this.revealOptions = {};
    } else {
      this.revealOptions = options;
    }

    if (this.registered) {
      this.animation.destroy(this.elementRef.nativeElement);
      this.registerAnimation();
    }
  }

  ngAfterViewInit(): void {
    this.registerAnimation();
  }

  ngOnDestroy(): void {
    this.animation.destroy(this.elementRef.nativeElement);
  }

  private registerAnimation(): void {
    queueMicrotask(() => {
      this.animation.registerReveal(this.elementRef.nativeElement, this.revealOptions);
      this.registered = true;
    });
  }
}
