import { DestroyRef, Injectable, inject } from '@angular/core';

type SceneCallback = (progress: number) => void;

/** Eases `value` through the a → b part of a 0–1 timeline. */
export function span(value: number, a: number, b: number): number {
  const t = Math.min(1, Math.max(0, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/**
 * The clock behind every pinned scene: a tall track with a sticky 100vh stage
 * inside, whose progress runs 0 → 1 while the stage is pinned. One listener and
 * one rAF serve the whole page. Under reduced motion nothing registers, and
 * each scene falls back to a plain layout in its own CSS.
 */
@Injectable({ providedIn: 'root' })
export class SceneService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly scenes = new Set<{ el: HTMLElement; cb: SceneCallback }>();
  private frame = 0;

  readonly reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    const schedule = () => {
      if (!this.frame) this.frame = requestAnimationFrame(this.tick);
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    this.destroyRef.onDestroy(() => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      cancelAnimationFrame(this.frame);
    });
  }

  track(el: HTMLElement, cb: SceneCallback): () => void {
    if (this.reduced) return () => undefined;
    const scene = { el, cb };
    this.scenes.add(scene);
    this.run(scene);
    return () => this.scenes.delete(scene);
  }

  private readonly tick = () => {
    this.frame = 0;
    this.scenes.forEach((scene) => this.run(scene));
  };

  private run({ el, cb }: { el: HTMLElement; cb: SceneCallback }): void {
    const rect = el.getBoundingClientRect();
    const travel = rect.height - innerHeight;
    cb(travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0);
  }
}
