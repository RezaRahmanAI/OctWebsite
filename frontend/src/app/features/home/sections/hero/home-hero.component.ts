import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
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
export class HomeHeroComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) data!: HomeContent['hero'];
  @Input() videoSrc = '/video/bg.mp4';
  @Input() videoPoster = '';

  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  activeSlide = 0;
  private slideIntervalId: number | null = null;

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

    this.startAutoSlide();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.restartAutoSlide();
      this.activeSlide = 0;
    }
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  setSlide(index: number): void {
    if (!this.data.highlightList?.length) return;
    this.activeSlide = index % this.data.highlightList.length;
    this.restartAutoSlide();
  }

  private startAutoSlide(): void {
    if (!this.data.highlightList?.length || this.slideIntervalId !== null) return;

    this.slideIntervalId = window.setInterval(() => {
      if (!this.data.highlightList?.length) return;
      this.activeSlide = (this.activeSlide + 1) % this.data.highlightList.length;
    }, 5200);
  }

  private restartAutoSlide(): void {
    this.clearAutoSlide();
    this.startAutoSlide();
  }

  private clearAutoSlide(): void {
    if (this.slideIntervalId !== null) {
      window.clearInterval(this.slideIntervalId);
      this.slideIntervalId = null;
    }
  }
}
