import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  inject,
  output,
  signal,
  viewChild
} from '@angular/core';
import { NavService } from '../core/nav.service';
import { MENU_LINKS, SITE } from '../data/site.data';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

/**
 * The full-screen menu sheet. Its photo and note follow the hovered link, and
 * picking a link plays the leave: the other items blur away, the word grows to
 * the middle, the page changes underneath, and the sheet draws up off it. The
 * navbar shows this only while the menu is open, and hears `closed` when it is done.
 */
@Component({
  selector: 'app-menu-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Logo],
  template: `
    <div class="mn" role="dialog" aria-modal="true" aria-label="Menu" [class.is-leaving]="leaving()" [class.is-lifting]="lifting()">
     <div class="mn__sheet" #sheet>
      <div class="mn__page">
      <span class="mn__band" aria-hidden="true"></span>
      <div class="mn__ghost-box" aria-hidden="true"><span>{{ shortName }}</span></div>

      <div class="mn__top">
        <a href="/" class="mn__logo" (click)="home($event)"><app-logo /></a>
        <button #closeBtn type="button" class="mn__close" aria-label="Close menu" (click)="closed.emit()">
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
  `,
  styles: [
    `
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
export class MenuSheet {
  private readonly nav = inject(NavService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');
  private readonly sheet = viewChild<ElementRef<HTMLElement>>('sheet');

  /** Asks the navbar to take the sheet away. */
  readonly closed = output<void>();

  readonly shortName = SITE.shortName;
  readonly links = MENU_LINKS;
  readonly leaving = signal(false);
  readonly lifting = signal(false);
  readonly picked = signal(-1);
  readonly active = signal(0);
  readonly preview = computed(() => this.links[this.active()]);
  private busy = false;
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    afterNextRender(() => this.closeBtn()?.nativeElement.focus());
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.busy) this.closed.emit();
  }

  /** The logo: close the menu, then play the opening again from the top. */
  home(event: Event): void {
    event.preventDefault();
    this.closed.emit();
    this.nav.home();
  }

  /**
   * Following a menu link. The other items blur away, the word you picked grows
   * to the middle of the screen, the page changes underneath, and then the sheet
   * draws up to uncover it. Under reduced motion it just closes and goes.
   */
  follow(to: string, event?: Event, index = -1): void {
    if (this.busy) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.closed.emit();
      this.nav.go(to);
      return;
    }
    this.busy = true;
    this.picked.set(index);
    this.leaving.set(true);
    const label = (event?.currentTarget as HTMLElement | undefined)?.querySelector<HTMLElement>('.mn__mask span');
    const sheet = this.sheet()?.nativeElement;
    if (label && sheet) this.fly(label, sheet);
    this.timers.push(
      setTimeout(() => this.nav.go(to, true), 850),
      setTimeout(() => this.lifting.set(true), 1150),
      setTimeout(() => this.closed.emit(), 1900)
    );
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
