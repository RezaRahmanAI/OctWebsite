import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PricingComponent } from '../../shared/components/pricing/pricing.component';
import {
  type AcademyFeature,
  type ZeroProgrammingTrack,
  kidsComputingFeatures,
  zeroProgrammingTracks,
  freelancingCourses,
} from '../../core/data/academy-programs.data';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterLink, PricingComponent],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.css',
})
export class AcademyComponent {
  @ViewChild('academyVideo', { static: false })
  academyVideo?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.academyVideo?.nativeElement;
    if (!video) return;

    video.muted = true; // ensure muted for autoplay policies

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        // Autoplay might still be blocked until user interaction
        console.warn('Autoplay prevented by browser:', err);
      });
    }
  }


  readonly kidsComputingFeatures: AcademyFeature[] = kidsComputingFeatures;

  readonly zeroProgrammingTracks: ZeroProgrammingTrack[] = zeroProgrammingTracks;

  readonly freelancingCourses: AcademyFeature[] = freelancingCourses;
}
