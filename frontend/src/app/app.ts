import { ChangeDetectionStrategy, Component, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import Lenis from 'lenis';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements AfterViewInit, OnDestroy {

  private lenis?: Lenis;
  private animationFrameId?: number;

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        smoothWheel: true,
        smoothTouch: false,
        duration: 1.1
      });

      const onFrame = (time: number) => {
        this.lenis?.raf(time);
        this.animationFrameId = requestAnimationFrame(onFrame);
      };

      this.animationFrameId = requestAnimationFrame(onFrame);
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.lenis?.destroy();
  }
}
