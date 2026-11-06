import { Injectable, signal } from '@angular/core';

/** Length of Home's opening sequence, up to the moment the header drops in. */
const INTRO_MS = 4600;

/** The opening sequence plays once per visit; `ready` is when the header may appear. */
@Injectable({ providedIn: 'root' })
export class IntroService {
  readonly ready = signal(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  /** Bumped each time the opening is asked to play again, so Home can start it over. */
  readonly run = signal(0);
  private started = false;

  /** Starts the opening over: the header leaves, and the next hero to appear plays it from the top. */
  replay(): void {
    this.started = false;
    this.ready.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.run.update((n) => n + 1);
  }

  /** Returns true if the sequence should play now, false if it has already played. */
  begin(): boolean {
    if (this.started) return false;
    this.started = true;
    setTimeout(() => this.ready.set(true), INTRO_MS);
    return true;
  }
}
