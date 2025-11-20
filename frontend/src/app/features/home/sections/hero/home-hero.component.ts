import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../core/models/home-content.model';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroComponent implements AfterViewInit {
  @Input({ required: true }) data!: HomeContent['hero'];
  @Input() videoSrc = '/video/bg.mp4';
  @Input() videoPoster = '';

  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    // Ensure muted before trying to play (important for autoplay policies)
    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay was blocked:', err);
        // Optional: show a play button overlay here if needed
      });
    }
  }
}
