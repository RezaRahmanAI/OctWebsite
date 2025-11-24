import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ScrollAnimationService } from '../../../core/services/scroll-animation.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css'],
})
export class PublicLayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainContainer', { static: true }) mainContainer?: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly scrollAnimation = inject(ScrollAnimationService);
  private navigationSub?: Subscription;

  ngAfterViewInit(): void {
    const mainElement = this.mainContainer?.nativeElement;
    if (!mainElement) {
      return;
    }

    this.scrollAnimation.init(mainElement);

    this.navigationSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.scrollAnimation.refresh(mainElement));
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
    this.scrollAnimation.destroy();
  }
}
