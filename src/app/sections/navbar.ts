import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { IntroService } from '../core/intro.service';
import { NavService } from '../core/nav.service';
import { SmoothScrollService } from '../core/smooth-scroll.service';
import { MENU_LINKS, SITE } from '../data/site.data';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

/**
 * A brown bar across the top with the logo hanging from it as a tab, between
 * Contact Us and Menu. On Home it waits for the opening sequence to finish. Menu is a full-screen sheet whose photo and note follow the hovered link.
 */
@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Logo, RouterLink],
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
      <div class="mn" role="dialog" aria-modal="true" aria-label="Menu" [class.is-leaving]="leaving()" [class.is-lifting]="lifting()">
       <div class="mn__sheet" #sheet>
        <div class="mn__page">
        <span class="mn__band" aria-hidden="true"></span>
        <div class="mn__ghost-box" aria-hidden="true"><span>{{ shortName }}</span></div>

        <div class="mn__top">
          <a href="/" class="mn__logo" (click)="home($event)"><app-logo /></a>
          <button #closeBtn type="button" class="mn__close" aria-label="Close menu" (click)="open.set(false)">
            <app-icon name="close" [size]="24" />
          </button>
        </div>

        <div class="mn__body">
          <nav aria-label="Main">
            <ul>
              @for (link of links; track link.to; let i = $index) {
                <li>
                  <button
                    type="button"
                    class="mn__link"
                    [class.is-on]="active() === i"
                    [class.is-picked]="picked() === i"
                    (click)="follow(link.to, $event, i)"
                    (mouseenter)="active.set(i)"
                    (focus)="active.set(i)">
                    <app-icon class="mn__icon" [name]="link.icon" [size]="24" />
                    <span class="mn__mask"><span [style.animation-delay.ms]="500 + i * 90">{{ link.label }}</span></span>
                    <small>{{ pad(i + 1) }}</small>
                  </button>
                </li>
              }
            </ul>
            <button type="button" class="plank mn__contact" (click)="follow('/contact-us')">
              Contact Us <app-icon name="leaf" />
            </button>
          </nav>

          <aside class="mn__preview" aria-hidden="true">
            <figure>
              @for (link of links; track link.to; let i = $index) {
                <img [src]="link.image" alt="" [class.is-on]="active() === i" />
              }
            </figure>
            <p class="mn__count">
              <i><app-icon [name]="preview().icon" [size]="20" /></i>
              {{ pad(active() + 1) }} / {{ pad(links.length) }}
            </p>
            <h2>{{ preview().label }}</h2>
            <p class="mn__note">{{ preview().note }}</p>
          </aside>
        </div>
        </div>
       </div>
      </div>
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

      .mn {
        position: fixed;
        inset: 0;
        z-index: 80;
      }
      .mn__sheet {
        position: absolute;
        inset: 0 0 auto;
        height: 100%;
        overflow: hidden;
        background: var(--bg-light);
        animation: mn-open 0.7s cubic-bezier(0.65, 0, 0.25, 1) both;
      }
      .mn__page {
        position: absolute;
        inset: 0 auto auto 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100svh;
        padding: 0 56px;
        overflow: hidden auto;
      }
      /* Picking a link: the rest of the sheet blurs away while the word flies to the middle. */
      .is-leaving .mn__top,
      .is-leaving nav,
      .is-leaving .mn__preview,
      .is-leaving .mn__ghost-box {
        animation: mn-away 0.6s ease both;
      }
      @keyframes mn-away {
        to {
          opacity: 0;
          filter: blur(16px);
        }
      }
      .mn__link.is-picked .mn__mask span {
        visibility: hidden;
      }
      /* Then the sheet draws up off the page it was covering. */
      .mn.is-lifting {
        pointer-events: none;
      }
      .mn.is-lifting .mn__sheet {
        animation: mn-lift 0.72s cubic-bezier(0.65, 0, 0.25, 1) both;
        box-shadow: 0 26px 50px -14px rgb(70 30 20 / 0.38);
      }
      @keyframes mn-lift {
        from {
          height: 100%;
        }
        to {
          height: 0;
        }
      }
      @keyframes mn-open {
        from {
          clip-path: inset(0 0 100% 0);
        }
        to {
          clip-path: inset(0);
        }
      }
      /* The sheet's leading edge: a thick band of the accent that thins out as it lands. */
      .mn__band {
        position: absolute;
        inset: 0;
        z-index: 5;
        background: var(--brown);
        pointer-events: none;
        animation: mn-band 0.78s cubic-bezier(0.65, 0, 0.25, 1) both;
      }
      @keyframes mn-band {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(100%);
        }
      }
      .mn__ghost-box {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }
      .mn__ghost-box span {
        position: absolute;
        inset-inline: 0;
        top: calc(100svh - 267px);
        text-align: center;
        white-space: nowrap;
        font-family: var(--font-body);
        font-weight: 400;
        font-size: 21.500vw;
        line-height: 1;
        letter-spacing: 0.01em;
        text-transform: uppercase;
        color: var(--ink);
        opacity: 0.055;
      }
      .mn__top {
        position: relative;
        flex: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 84px;
      }
      .mn__top::after {
        content: '';
        position: absolute;
        inset: auto 0 0;
        height: 1px;
        background: var(--line);
        transform-origin: left;
        animation: mn-line 0.7s var(--ease) both 0.4s;
      }
      @keyframes mn-line {
        from {
          transform: scaleX(0);
        }
      }
      .mn__logo,
      .mn__close {
        animation: mn-fade 0.5s ease both 0.35s;
      }
      @keyframes mn-fade {
        from {
          opacity: 0;
        }
      }
      .mn__logo {
        color: var(--brown);
      }
      .mn__close {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        margin-right: -9px;
        border: 0;
        background: none;
        color: var(--brown);
        cursor: pointer;
      }
      .mn__body {
        position: relative;
        flex: 1;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 38.750vw;
        column-gap: 6.660vw;
        align-items: center;
        padding-block: 56px 40px;
      }
      .mn__link {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 20px;
        padding: 11px 24px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--brown);
        font-family: var(--font-body);
        font-weight: 700;
        font-size: 33.120px;
        line-height: 41px;
        letter-spacing: -0.994px;
        text-transform: uppercase;
        text-align: start;
        cursor: pointer;
        transition: background-color 0.35s ease;
      }
      .mn__link:hover,
      .mn__link:focus-visible {
        background: var(--bg-deep);
      }
      .mn__icon {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .mn__link:hover .mn__icon,
      .mn__link:focus-visible .mn__icon {
        opacity: 1;
      }
      .mn__mask {
        display: block;
        overflow: hidden;
      }
      .mn__mask span {
        display: block;
        animation: mn-rise 0.8s var(--ease) both;
      }
      @keyframes mn-rise {
        from {
          transform: translateY(105%);
        }
      }
      .mn__link small {
        margin-left: auto;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 1.560px;
        color: var(--muted);
        opacity: 0.6;
        transition: opacity 0.3s ease;
        animation: mn-fade 0.5s ease both 0.4s;
      }
      .mn__link:hover small,
      .mn__link:focus-visible small {
        opacity: 1;
      }
      .mn__contact {
        margin: 33px 0 0 12px;
        animation: mn-fade 0.6s ease both 0.95s;
      }
      .mn__preview {
        align-self: start;
        animation: mn-fade 0.6s ease both 1s;
      }
      .mn__preview figure {
        position: relative;
        margin: 0;
        width: 100%;
        height: calc(100svh - 396px);
        min-height: 240px;
        overflow: hidden;
        border-radius: 12px;
      }
      .mn__preview img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transform: scale(1.06);
        transition:
          opacity 0.5s ease,
          transform 1s var(--ease);
      }
      .mn__preview img.is-on {
        opacity: 1;
        transform: none;
      }
      .mn__count {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 22px;
        font-size: 14px;
        letter-spacing: 3.640px;
        color: var(--muted);
      }
      .mn__count i {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--bg-deep);
        color: var(--brown);
      }
      .mn__preview h2 {
        margin-top: 8px;
        font-family: var(--font-body) !important;
        font-style: normal !important;
        font-weight: 400 !important;
        font-size: 49.500px;
        line-height: 60px;
        letter-spacing: -0.495px !important;
        color: var(--brown);
      }
      .mn__note {
        margin-top: 10px;
        max-width: 44ch;
        color: var(--muted);
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
        .mn__page {
          padding-inline: var(--pad);
        }
        .mn__body {
          grid-template-columns: minmax(0, 1fr);
          align-items: start;
        }
        .mn__preview {
          display: none;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .mn__sheet,
        .mn__band,
        .mn__top::after,
        .mn__logo,
        .mn__close,
        .mn__mask span,
        .mn__link small,
        .mn__contact,
        .mn__preview {
          animation: none;
        }
        .mn__band {
          display: none;
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
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  readonly name = SITE.name;
  readonly shortName = SITE.shortName;
  readonly links = MENU_LINKS;
  readonly open = signal(false);
  readonly leaving = signal(false);
  readonly lifting = signal(false);
  readonly picked = signal(-1);
  private busy = false;
  private readonly sheet = viewChild<ElementRef<HTMLElement>>('sheet');
  readonly active = signal(0);
  readonly preview = computed(() => this.links[this.active()]);

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
        this.closeBtn()?.nativeElement.focus();
      } else {
        this.smooth.start();
        document.documentElement.style.overflow = '';
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.busy) this.open.set(false);
  }

  /**
   * Following a menu link. The other items blur away, the word you picked grows
   * to the middle of the screen, the page changes underneath, and then the sheet
   * draws up to uncover it. Under reduced motion it just closes and goes.
   */
  /** The logo: close the menu if it is open, then play the opening again from the top. */
  home(event: Event): void {
    event.preventDefault();
    this.open.set(false);
    this.nav.home();
  }

  follow(to: string, event?: Event, index = -1): void {
    if (this.busy) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.open.set(false);
      this.nav.go(to);
      return;
    }
    this.busy = true;
    this.picked.set(index);
    this.leaving.set(true);
    const label = (event?.currentTarget as HTMLElement | undefined)?.querySelector<HTMLElement>('.mn__mask span');
    const sheet = this.sheet()?.nativeElement;
    if (label && sheet) this.fly(label, sheet);
    setTimeout(() => this.nav.go(to, true), 850);
    setTimeout(() => this.lifting.set(true), 1150);
    setTimeout(() => {
      this.open.set(false);
      this.leaving.set(false);
      this.lifting.set(false);
      this.picked.set(-1);
      this.busy = false;
    }, 1900);
  }

  /**
   * A copy of the picked word that travels from its place in the list to the middle
   * of the screen, growing as it goes. It is laid out at its final size and shrunk
   * back for the start, so it lands crisp and at full strength instead of blurred.
   */
  private fly(label: HTMLElement, sheet: HTMLElement): void {
    const from = label.getBoundingClientRect();
    const style = getComputedStyle(label);
    const startSize = parseFloat(style.fontSize);
    const endSize = Math.min(innerWidth * 0.0986, ((innerWidth * 0.82) / from.width) * startSize);
    const word = document.createElement('span');
    word.textContent = label.textContent;
    word.setAttribute('aria-hidden', 'true');
    Object.assign(word.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      margin: '0',
      zIndex: '6',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      transformOrigin: '0 0',
      fontFamily: style.fontFamily,
      fontWeight: '700',
      fontSize: `${endSize}px`,
      lineHeight: style.lineHeight === 'normal' ? 'normal' : `${(parseFloat(style.lineHeight) / startSize) * endSize}px`,
      letterSpacing: `${(parseFloat(style.letterSpacing) / startSize) * endSize}px`,
      textTransform: style.textTransform,
      color: getComputedStyle(document.documentElement).getPropertyValue('--brown').trim() || style.color,
      opacity: '1'
    });
    sheet.appendChild(word);
    const end = word.getBoundingClientRect();
    const k = startSize / endSize;
    const endX = innerWidth / 2 - end.width / 2;
    const endY = innerHeight / 2 - end.height / 2;
    const startX = from.left - ((end.width * k) - from.width) / 2 * 0;
    word.animate(
      [
        { transform: `translate(${startX}px, ${from.top}px) scale(${k})` },
        { transform: `translate(${endX}px, ${endY}px) scale(1)` }
      ],
      { duration: 1000, delay: 100, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', fill: 'both' }
    );
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
