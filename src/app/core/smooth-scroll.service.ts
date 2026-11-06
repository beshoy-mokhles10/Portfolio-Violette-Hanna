import { Injectable } from '@angular/core';
import Lenis from 'lenis';

/** Lenis smooth scrolling. Off under reduced motion, where the browser's own scroll stands in. */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private lenis?: Lenis;

  init(): void {
    if (this.lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.lenis = new Lenis({
      // Fitted to the reference: 50% of a scroll in 430ms, 90% in 1280ms, 99% in 2200ms.
      duration: 3.95,
      easing: (t) => 1 - Math.pow(1 - t, 6),
      wheelMultiplier: 1
    });
    const raf = (time: number) => {
      this.lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  scrollTo(target: string | number, immediate = false): void {
    if (this.lenis) {
      this.lenis.resize();
      this.lenis.scrollTo(typeof target === 'string' ? `#${target}` : target, { duration: 1.4, immediate, force: immediate });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target });
    } else {
      document.getElementById(target)?.scrollIntoView();
    }
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }
}
