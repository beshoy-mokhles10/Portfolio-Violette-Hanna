import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { WALL, WallCategory } from '../data/work.data';
import { Lightbox } from '../shared/lightbox';
import { Reveal } from '../shared/reveal.directive';

type Filter = 'All' | WallCategory;

const FILTERS: Filter[] = ['All', 'Portraits', 'Weddings', 'Commercial', 'Landscape', 'Events'];
/** How long a photograph stays on the stage before the next one fades in. */
const HOLD_MS = 5000;

/**
 * One large photograph on a stage that changes by itself, slowly, with a small
 * strip of the others beneath it and a row of categories to narrow them down.
 * Pressing the stage opens the photograph in the viewer.
 */
@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Lightbox, Reveal],
  template: `
    <section id="gallery" class="gl" aria-labelledby="gl-heading">
      <header class="section-head">
        <p class="eyebrow" appReveal>Real Moments</p>
        <h2 id="gl-heading" class="heading" appReveal="80">Every Story Through One Lens</h2>
      </header>

      <div class="gl__tabs" role="group" aria-label="Filter photographs" appReveal="120">
        @for (f of filters; track f) {
          <button type="button" [class.is-on]="filter() === f" [attr.aria-pressed]="filter() === f" (click)="setFilter(f)">
            {{ f }}
          </button>
        }
      </div>

      <div
        class="gl__stage"
        (mouseenter)="paused.set(true)"
        (mouseleave)="paused.set(false)"
        (focusin)="paused.set(true)"
        (focusout)="paused.set(false)">
        @for (item of items(); track item.image; let i = $index) {
          <button
            type="button"
            class="gl__slide"
            [class.is-on]="i === index()"
            [attr.aria-hidden]="i !== index()"
            [attr.tabindex]="i === index() ? 0 : -1"
            [attr.aria-label]="'View photograph: ' + item.title"
            (click)="open.set(i)">
            <img [src]="item.image" [alt]="item.alt" [attr.loading]="i === 0 ? 'eager' : 'lazy'" decoding="async" draggable="false" />
          </button>
        }
        <div class="gl__shade" aria-hidden="true"></div>

        @if (current(); as now) {
          <div class="gl__cap" aria-live="polite">
            <span class="gl__kind">{{ now.category }}</span>
            <span class="gl__title">{{ now.title }}</span>
          </div>
        }
        <span class="gl__count" aria-hidden="true">{{ pad(index() + 1) }} / {{ pad(items().length) }}</span>

        <button type="button" class="gl__go gl__go--prev" aria-label="Previous photograph" (click)="step(-1)">&#8592;</button>
        <button type="button" class="gl__go gl__go--next" aria-label="Next photograph" (click)="step(1)">&#8594;</button>
      </div>

      <ul class="gl__thumbs" aria-label="Photographs">
        @for (item of items(); track item.image; let i = $index) {
          <li>
            <button type="button" [class.is-on]="i === index()" [attr.aria-label]="'Show ' + item.title" (click)="pick(i)">
              <img [src]="item.image" alt="" loading="lazy" decoding="async" draggable="false" />
            </button>
          </li>
        }
      </ul>
    </section>
    <app-lightbox [items]="items()" [(index)]="open" />
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--bg);
      }
      .gl {
        padding: var(--section-y) var(--pad);
      }
      .gl__tabs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin: 40px 0 28px;
      }
      .gl__tabs button {
        padding: 9px 22px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: none;
        color: var(--ink);
        cursor: pointer;
        transition:
          background-color 0.3s ease,
          color 0.3s ease,
          border-color 0.3s ease;
      }
      .gl__tabs button:hover {
        border-color: var(--brown);
      }
      .gl__tabs button.is-on {
        background: var(--brown);
        border-color: var(--brown);
        color: var(--on-brown);
      }
      .gl__stage {
        position: relative;
        max-width: 1100px;
        height: clamp(300px, 44vw, 580px);
        margin-inline: auto;
        overflow: hidden;
        border-radius: 8px;
        background: var(--past);
      }
      .gl__slide {
        position: absolute;
        inset: 0;
        padding: 0;
        border: 0;
        background: none;
        cursor: zoom-in;
        opacity: 0;
        transition: opacity 0.9s ease;
      }
      .gl__slide.is-on {
        opacity: 1;
        z-index: 1;
      }
      .gl__slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1);
        transition: transform 0.9s ease;
      }
      /* A very slow push in on the photograph that is showing. */
      .gl__slide.is-on img {
        transform: scale(1.06);
        transition: transform 7s linear;
      }
      .gl__slide:focus-visible {
        outline: 2px solid var(--brown);
        outline-offset: -4px;
      }
      .gl__shade {
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
        background: linear-gradient(transparent 55%, rgb(79 47 40 / 0.62));
      }
      .gl__cap {
        position: absolute;
        z-index: 3;
        left: clamp(18px, 3vw, 34px);
        bottom: clamp(14px, 2.4vw, 28px);
        display: flex;
        flex-direction: column;
        gap: 2px;
        color: #fff;
        pointer-events: none;
      }
      .gl__kind {
        font-size: 12px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        opacity: 0.85;
      }
      .gl__title {
        font-family: 'Allura', cursive;
        font-size: clamp(32px, 4vw, 50px);
        line-height: 1.05;
        text-shadow: 0 2px 20px rgb(0 0 0 / 0.4);
      }
      .gl__count {
        position: absolute;
        z-index: 3;
        right: clamp(18px, 3vw, 34px);
        bottom: clamp(18px, 2.6vw, 32px);
        font-size: 13px;
        letter-spacing: 0.2em;
        color: #fff;
        opacity: 0.85;
      }
      .gl__go {
        position: absolute;
        z-index: 3;
        top: 50%;
        width: 44px;
        height: 44px;
        margin-top: -22px;
        display: grid;
        place-items: center;
        border: 0;
        border-radius: 50%;
        background: rgb(255 255 255 / 0.2);
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition:
          opacity 0.3s ease,
          background-color 0.3s ease;
      }
      .gl__stage:hover .gl__go,
      .gl__go:focus-visible {
        opacity: 1;
      }
      .gl__go:hover {
        background: var(--brown);
      }
      .gl__go--prev {
        left: 18px;
      }
      .gl__go--next {
        right: 18px;
      }
      .gl__thumbs {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 16px auto 0;
        padding: 4px;
        overflow-x: auto;
        list-style: none;
      }
      .gl__thumbs button {
        display: block;
        width: 92px;
        height: 68px;
        padding: 0;
        border: 2px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: none;
        cursor: pointer;
        opacity: 0.5;
        transition:
          opacity 0.3s ease,
          border-color 0.3s ease;
      }
      .gl__thumbs button:hover,
      .gl__thumbs button.is-on {
        opacity: 1;
      }
      .gl__thumbs button.is-on {
        border-color: var(--brown);
      }
      .gl__thumbs img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      @media (max-width: 700px) {
        .gl__go {
          opacity: 1;
          width: 38px;
          height: 38px;
          margin-top: -19px;
        }
        .gl__thumbs {
          justify-content: flex-start;
        }
        .gl__thumbs button {
          flex: none;
          width: 76px;
          height: 56px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .gl__slide,
        .gl__slide img,
        .gl__slide.is-on img {
          transition: none;
          transform: none;
        }
      }
    `
  ]
})
export class Gallery {
  private readonly destroyRef = inject(DestroyRef);

  readonly filters = FILTERS;
  readonly filter = signal<Filter>('All');
  readonly index = signal(0);
  readonly open = signal<number | null>(null);
  readonly paused = signal(false);

  readonly items = computed(() => {
    const f = this.filter();
    return f === 'All' ? WALL : WALL.filter((w) => w.category === f);
  });
  readonly current = computed(() => this.items()[this.index()] ?? null);

  constructor() {
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let last = 0;
      const timer = setInterval(() => {
        const now = Date.now();
        if (this.paused() || this.open() !== null || document.hidden) {
          last = now;
          return;
        }
        if (now - last >= HOLD_MS) {
          last = now;
          this.step(1);
        }
      }, 500);
      this.destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  setFilter(f: Filter): void {
    this.filter.set(f);
    this.index.set(0);
  }

  step(by: number): void {
    const total = this.items().length;
    this.index.set((this.index() + by + total) % total);
  }

  pick(i: number): void {
    this.index.set(i);
  }
}
