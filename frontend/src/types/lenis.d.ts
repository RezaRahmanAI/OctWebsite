declare module 'lenis' {
  type LenisDirection = 'vertical' | 'horizontal';
  type LenisGestureDirection = 'vertical' | 'horizontal' | 'both';

  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    direction?: LenisDirection;
    gestureDirection?: LenisGestureDirection;
    smooth?: boolean;
    smoothTouch?: boolean;
    smoothWheel?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    stop(): void;
    start(): void;
    destroy(): void;
  }
}
