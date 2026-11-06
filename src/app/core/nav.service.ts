import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IntroService } from './intro.service';
import { SmoothScrollService } from './smooth-scroll.service';

/** Follows a menu or footer link: a route, or a section on Home from wherever you are. */
@Injectable({ providedIn: 'root' })
export class NavService {
  private readonly router = inject(Router);
  private readonly smooth = inject(SmoothScrollService);
  private readonly intro = inject(IntroService);

  /** Her name was clicked: back to the top, and the opening plays again, as on a fresh visit. */
  home(): void {
    const onHome = this.router.url.split('#')[0] === '/';
    this.intro.replay();
    if (onHome) {
      this.smooth.scrollTo(0, true);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  go(to: string, immediate = false): void {
    if (to.startsWith('/')) {
      this.router.navigateByUrl(to);
    } else if (this.router.url.split('#')[0] === '/') {
      this.smooth.scrollTo(to, immediate);
    } else {
      // Home's images and tall tracks need a beat to lay out before the jump.
      this.router.navigateByUrl('/').then(() => setTimeout(() => this.smooth.scrollTo(to, true), 200));
    }
  }
}
