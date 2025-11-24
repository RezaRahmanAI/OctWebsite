import { Directive, ElementRef, Input, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { AnimationService, ScrollRevealOptions } from '../../core/services/animation.service';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input('appScrollReveal') options: ScrollRevealOptions | '' = {};

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly animationService: AnimationService,
    private readonly ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.animationService.registerReveal(this.elementRef.nativeElement, this.normalizeOptions(this.options));
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
