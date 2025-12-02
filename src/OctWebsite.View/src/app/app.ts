import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  NgZone,
  OnDestroy,
  OnInit,
  HostListener,
  signal,
  inject,
} from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SmoothScroller } from './core/services/smooth-scroller';
import { ContactChannelsApiService } from './core/services/contact-channels-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit, OnDestroy, OnInit {
  private scroller?: SmoothScroller;
  private animationFrameId?: number;
  private readonly scrollThreshold = 220;

  private readonly contactChannels = inject(ContactChannelsApiService);
  private readonly router = inject(Router);
  readonly showScrollTop = signal(false);

  // hide navbar/footer on these routes
  private readonly hideChromePrefixes = ['/dashboard', '/login'];

  readonly showShell$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(() => !this.hideChromePrefixes.some((p) => this.router.url.startsWith(p))),
    startWith(true)
  );

  constructor(private readonly ngZone: NgZone) {}

  ngOnInit(): void {
    this.contactChannels.load();
    this.updateScrollIndicator();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scroller = new SmoothScroller({
        smoothWheel: true,
        smoothTouch: false,
        duration: 1.1,
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

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrollIndicator();
  }

  scrollToTop(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateScrollIndicator(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const shouldShow = window.scrollY > this.scrollThreshold;
    if (this.showScrollTop() !== shouldShow) {
      this.showScrollTop.set(shouldShow);
    }
  }
}
