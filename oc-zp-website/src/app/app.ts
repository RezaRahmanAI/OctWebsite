import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeTransition } from './core/utils/route-animations';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { SmoothScrollService } from './core/services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [routeTransition],
})
export class AppComponent {
  private readonly smoothScroll = inject(SmoothScrollService);

  constructor() {
    this.smoothScroll.init();
  }
}
