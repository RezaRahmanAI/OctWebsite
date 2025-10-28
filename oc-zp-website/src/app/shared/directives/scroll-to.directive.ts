import { Directive, HostListener, Input } from '@angular/core';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

@Directive({
  selector: '[scrollTo]',
  standalone: true,
})
export class ScrollToDirective {
  @Input('scrollTo') target?: string;

  constructor(private readonly smoothScroll: SmoothScrollService) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (!this.target) {
      return;
    }
    event.preventDefault();
    this.smoothScroll.scrollToSelector(this.target.startsWith('#') ? this.target : `#${this.target}`, {
      offset: -80,
    });
  }
}
