import { Directive, ElementRef, Input, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { AnimationService, ScrollRevealOptions } from '../../core/services/animation.service';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input('appScrollReveal') options: ScrollRevealOptions | '' = {};
  @Input() revealDelay?: number;
  @Input() revealOffset?: number;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly animationService: AnimationService,
    private readonly ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        const normalizedOptions = this.normalizeOptions(this.options);

        if (this.revealDelay != null) {
          normalizedOptions.delay = this.revealDelay;
        }

        if (this.revealOffset != null) {
          normalizedOptions.start = `top bottom-=${this.revealOffset}`;
        }

        this.animationService.registerReveal(this.elementRef.nativeElement, normalizedOptions);
      });
    });
  }

  ngOnDestroy(): void {
    this.animationService.destroy(this.elementRef.nativeElement);
  }

  private normalizeOptions(options: ScrollRevealOptions | ''): ScrollRevealOptions {
    if (options === '' || options == null) {
      return {};
    }

    return options;
  }
}
