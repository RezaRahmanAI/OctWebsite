import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

declare global {
  interface Window {
    Lenis?: any;
  }
}

const initLenis = () => {
  if (typeof window === 'undefined' || !window.Lenis) {
    return;
  }

  const lenis = new window.Lenis({
    duration: 1.15,
    smoothWheel: true,
    smoothTouch: true,
    autoRaf: false,
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
};

bootstrapApplication(App, appConfig)
  .then(() => initLenis())
  .catch((err) => console.error(err));
