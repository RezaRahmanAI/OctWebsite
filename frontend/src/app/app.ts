import { ChangeDetectionStrategy, Component, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SmoothScroller } from './core/services/smooth-scroller';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements AfterViewInit, OnDestroy {
  private scroller?: SmoothScroller;
  private animationFrameId?: number;

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scroller = new SmoothScroller({
        smoothWheel: true,
        smoothTouch: false,
        duration: 1.1
      });

      const onFrame = (time: number) => {
        this.scroller?.raf(time);
        this.animationFrameId = requestAnimationFrame(onFrame);
      };

      this.animationFrameId = requestAnimationFrame(onFrame);
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.scroller?.destroy();
  }
}
