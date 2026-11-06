import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { IntroService } from '../core/intro.service';
import { NavService } from '../core/nav.service';
import { SmoothScrollService } from '../core/smooth-scroll.service';
import { SITE } from '../data/site.data';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';
import { MenuSheet } from './menu-sheet';

/**
 * A brown bar across the top with the logo hanging from it as a tab, between
 * Contact Us and Menu. On Home it waits for the opening sequence to finish.
 * Menu opens the full-screen sheet (see MenuSheet).
 */
@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Logo, MenuSheet, RouterLink],
  template: `
    <header class="nv" [class.is-hidden]="hidden()">
      <a class="nv__btn" routerLink="/contact-us" aria-label="Contact us">
        <span class="nv__label">Contact Us</span>
        <app-icon name="chat" [size]="18" />
      </a>
      <a class="nv__tab" href="/" [attr.aria-label]="name + ', home'" (click)="home($event)"><app-logo /></a>
      <button type="button" class="nv__btn" aria-label="Open menu" [attr.aria-expanded]="open()" (click)="open.set(true)">
        <span class="nv__label">Menu</span>
        <svg class="nv__lines" viewBox="0 0 18 14" width="18" height="14" aria-hidden="true">
          <path d="M1 2h16" /><path d="M1 7h12" /><path d="M1 12h7" />
        </svg>
      </button>
    </header>

    @if (open()) {
      <app-menu-sheet (closed)="open.set(false)" />
    }
  `,
  styles: [
    `
      .nv {
        position: fixed;
        inset: 0 0 auto;
        z-index: 60;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: calc(var(--bar-h) + 14px) clamp(16px, 3vw, 42px) 0;
        pointer-events: none;
      }
      /* Opening: the bar draws out from the middle, then the tab drops from it and the buttons follow. */
      .nv::before {
        content: '';
        position: absolute;
        inset: 0 0 auto;
        height: var(--bar-h);
        /* A gradient, not a colour, so Safari does not paint its own toolbar with it. */
        background: linear-gradient(var(--brown), var(--brown));
        transition: transform 1s cubic-bezier(0.65, 0, 0.25, 1) 0s;
      }
      .nv.is-hidden::before {
        transform: scaleX(0);
        transition-duration: 0s;
      }
      .nv > * {
        pointer-events: auto;
        transition:
          translate 0.8s var(--ease) 0.55s,
          opacity 0.5s ease 0.55s;
      }
      .nv__tab {
        transition-delay: 0.35s, 0.35s;
      }
      .nv.is-hidden > * {
        translate: 0 -90px;
        opacity: 0;
        pointer-events: none;
        transition-duration: 0s;
      }
      .nv.is-hidden .nv__tab {
        translate: -50% -70px;
      }
      .nv__btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        height: 39px;
        padding-inline: 14px;
        border: 0;
        border-radius: 6px;
        background: var(--brown);
        color: var(--on-nav);
        font-size: 16px;
        font-weight: 700;
        line-height: 19px;
        letter-spacing: -0.48px;
        text-transform: uppercase;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .nv__btn:hover {
        background: var(--brown-dark);
      }
      .nv__lines path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.800;
        stroke-linecap: round;
        transform-origin: 1px 50%;
        transition: transform 0.4s var(--ease);
      }
      .nv__btn:hover .nv__lines path:nth-child(1) {
        transform: scaleX(0.45);
      }
      .nv__btn:hover .nv__lines path:nth-child(3) {
        transform: scaleX(2.28);
      }
      .nv__tab {
        position: absolute;
        top: var(--bar-h);
        left: 50%;
        translate: -50% 0;
        display: block;
        padding: 8px 16px 9px;
        border-radius: 0 0 10px 10px;
        background: linear-gradient(var(--tab-bg), var(--tab-bg));
        color: var(--tab-fg);
      }
      /* The tab flares into the bar on both sides with inward-curving corners. */
      .nv__tab::before,
      .nv__tab::after {
        content: '';
        position: absolute;
        top: 0;
        width: 20px;
        height: 20px;
      }
      .nv__tab::before {
        right: 100%;
        background: radial-gradient(circle at 0 100%, transparent 19.5px, var(--tab-bg) 20px);
      }
      .nv__tab::after {
        left: 100%;
        background: radial-gradient(circle at 100% 100%, transparent 19.5px, var(--tab-bg) 20px);
      }

      @media (max-width: 860px) {
        .nv__label {
          display: none;
        }
        .nv__btn {
          width: 40px;
          justify-content: center;
          padding: 0 !important;
        }
      }
    `
  ]
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly nav = inject(NavService);
  private readonly smooth = inject(SmoothScrollService);
  private readonly intro = inject(IntroService);

  readonly name = SITE.name;
  readonly open = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );
  readonly hidden = computed(() => this.url().split('#')[0] === '/' && !this.intro.ready());

  constructor() {
    effect(() => {
      if (this.open()) {
        this.smooth.stop();
        document.documentElement.style.overflow = 'hidden';
      } else {
        this.smooth.start();
        document.documentElement.style.overflow = '';
      }
    });
  }

  /** The logo: close the menu if it is open, then play the opening again from the top. */
  home(event: Event): void {
    event.preventDefault();
    this.open.set(false);
    this.nav.home();
  }
}
