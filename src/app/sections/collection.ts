import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { SceneService, span } from '../core/scene.service';
import { COLLECTION } from '../data/work.data';
import { DragCursor } from '../shared/drag-cursor';
import { Reveal } from '../shared/reveal.directive';

/** Share of the scene spent on the opening, before the row starts to move. */
const OPEN_END = 0.1;
/** Time constant of the row easing behind the scroll. */
const SETTLE_MS = 200;

/**
 * Prints dealt across a table. The section opens on its heading; that blurs away
 * as the first print rises from below, and its neighbours fan out from behind it,
 * smaller and leaning in toward it. Scrolling or dragging then walks the row.
 */
@Component({
  selector: 'app-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragCursor, Reveal],
  template: `
    <section id="collection" class="cl" #track aria-label="Collection">
      <div class="cl__stage" #stage (pointerdown)="dragStart($event)">
        <span class="cl__ghost" aria-hidden="true">Collection</span>

        <div class="ci" #intro>
          <p class="eyebrow" appReveal>Print Collection</p>
          <h2 class="heading" appReveal="80">Keep The Moment Close</h2>
          <p class="ci__p1" appReveal="120">
            Step into a collection of moments from every kind of shoot: faces, wedding days, carefully lit products and
            wide open landscapes, each one chosen because it stayed with me.
          </p>
          <p class="ci__p2" appReveal="220">
            These images are more than records. They are fragments of stories that unfold in a single glance, a held
            breath, or a change in the light. Take your time with them.
          </p>
        </div>

        <header class="cl__caption" aria-live="polite">
          <h3>{{ active().title }}</h3>
          <p class="cl__count">{{ pad(index() + 1) }} / {{ pad(prints.length) }}</p>
          <p class="cl__note">{{ active().note }}</p>
        </header>

        <div class="cl__row" #row>
          @for (print of prints; track print.image) {
            <figure class="cl__card">
              <img [src]="print.image" [attr.alt]="print.title" draggable="false" decoding="async" />
            </figure>
          }
        </div>

        <app-drag-cursor />
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--bg);
      }
      .cl {
        height: 947vh;
      }
      .cl__stage {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
        cursor: none;
        touch-action: pan-y;
        user-select: none;
      }
      .cl__ghost {
        position: absolute;
        left: 0;
        bottom: 1.65vw;
        white-space: nowrap;
        font-family: var(--font-head);
        font-size: 18.51vw;
        line-height: 0.9;
        letter-spacing: 3.7vw;
        text-transform: uppercase;
        color: var(--ghost-c);
        opacity: var(--ghost, 0);
        pointer-events: none;
      }

      .ci {
        position: absolute;
        inset: 0;
        z-index: 12;
        padding: 79px 60px 0;
        will-change: opacity, filter, transform;
      }
      .ci .heading {
        margin-top: 20px;
      }
      .ci__p1,
      .ci__p2 {
        position: absolute;
        width: 39.1vw;
        text-align: justify;
        color: var(--muted);
      }
      .ci__p1 {
        left: 30.5vw;
        top: 229px;
      }
      .ci__p2 {
        left: 56.3vw;
        top: 340px;
      }

      h3 {
        position: absolute;
        left: 60px;
        top: 86px;
        font-family: var(--font-body);
        font-weight: 400;
        font-size: 36px;
        line-height: 37.8px;
        letter-spacing: -0.36px;
        text-transform: none;
        color: var(--ink);
      }
      .cl__caption {
        position: absolute;
        inset: 0;
        z-index: 15;
        pointer-events: none;
        opacity: var(--caption, 0);
      }
      .cl__count {
        position: absolute;
        left: 60px;
        top: 151px;
        font-size: 13px;
        line-height: 15.6px;
        letter-spacing: 3.38px;
        color: var(--muted);
      }
      .cl__note {
        position: absolute;
        left: 73.8vw;
        top: 96px;
        width: 20.5vw;
        min-width: 240px;
        color: var(--muted);
      }

      .cl__card {
        position: absolute;
        left: 50%;
        top: 58.4%;
        margin: 0;
        width: var(--card, min(30vw, 42.7svh));
        aspect-ratio: 385 / 500;
        box-shadow: 0 26px 46px -18px rgb(60 50 30 / 0.42);
        transform: translate(-50%, -50%);
        will-change: transform;
      }
      .cl__card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
      }

      @media (max-width: 860px) {
        .cl__stage {
          cursor: auto;
        }
        .ci {
          padding: 79px var(--pad) 0;
        }
        .ci__p1,
        .ci__p2 {
          position: static;
          width: auto;
          margin-top: 18px;
          text-align: left;
        }
        .cl__card {
          --card: min(62vw, 44svh);
          top: 42%;
        }
        h3,
        .cl__count,
        .cl__note {
          position: static;
          width: auto;
          text-align: center;
        }
        h3 {
          font-size: 28px;
        }
        .cl__caption {
          inset: auto var(--pad) clamp(70px, 13svh, 110px);
          display: grid;
          gap: 8px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .cl {
          height: auto;
        }
        .cl__stage {
          position: relative;
          height: auto;
          padding-bottom: 40px;
          cursor: auto;
        }
        .ci {
          position: relative;
          padding-bottom: 300px;
        }
        .cl__caption,
        .cl__ghost,
        app-drag-cursor {
          display: none;
        }
        .cl__row {
          display: flex;
          gap: 18px;
          padding-inline: 60px;
          overflow-x: auto;
        }
        .cl__card {
          position: relative;
          left: auto;
          top: auto;
          flex: none;
          transform: none;
        }
      }
    `
  ]
})
export class Collection {
  private readonly scenes = inject(SceneService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly row = viewChild.required<ElementRef<HTMLElement>>('row');
  private readonly intro = viewChild.required<ElementRef<HTMLElement>>('intro');

  readonly prints = COLLECTION;
  private target = 0;
  private current = 0;
  private fade = 0;
  private rise = 0;
  private raf = 0;
  private last = 0;
  readonly index = signal(0);
  readonly active = computed(() => this.prints[this.index()]);

  constructor() {
    afterNextRender(() => {
      const stop = this.scenes.track(this.track().nativeElement, (p) => this.layout(p));
      this.destroyRef.onDestroy(() => {
        stop();
        cancelAnimationFrame(this.raf);
      });
    });
  }

  private gap(): number {
    return innerWidth > 860 ? innerWidth * 0.3525 : innerWidth * 0.76;
  }

  private layout(p: number): void {
    const last = this.prints.length - 1;
    this.target = Math.min(1, Math.max(0, (p - OPEN_END) / (1 - OPEN_END))) * last;

    // The heading blurs away and drifts as the first print rises from below.
    const leave = Math.min(1, Math.max(0, (p - 0.05) / 0.065));
    const drift = Math.min(1, p / 0.11);
    const intro = this.intro().nativeElement.style;
    intro.opacity = (1 - leave).toFixed(3);
    intro.filter = leave > 0 ? `blur(${(leave * 8).toFixed(1)}px)` : 'none';
    intro.transform = `translateX(${(drift * 6.500).toFixed(2)}vw)`;
    intro.visibility = leave >= 1 ? 'hidden' : 'visible';

    this.rise = (1 - span(p, 0.035, 0.09)) * innerHeight * 0.85;
    // The neighbours fade in where they stand; the caption follows just after.
    this.fade = Math.min(1, Math.max(0, (p - 0.075) / 0.045));
    const stage = this.stage().nativeElement.style;
    stage.setProperty('--ghost', this.fade.toFixed(3));
    stage.setProperty('--caption', span(p, 0.112, 0.13).toFixed(3));

    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.ease);
    }
  }

  private readonly ease = (now: number) => {
    const k = 1 - Math.exp(-(now - this.last) / SETTLE_MS);
    this.last = now;
    this.current += (this.target - this.current) * k;
    if (Math.abs(this.target - this.current) < 0.001) this.current = this.target;
    this.place();
    this.raf = this.current === this.target ? 0 : requestAnimationFrame(this.ease);
  };

  private place(): void {
    const position = this.current;
    const last = this.prints.length - 1;
    const fade = this.fade;
    const rise = this.rise;
    const gap = this.gap();
    const lift = innerHeight * 0.034;
    const cards = this.row().nativeElement.children as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < cards.length; i++) {
      // The row is a loop: the last print stands to the left of the first.
      const count = cards.length;
      const offset = ((((i - position) % count) + count + count / 2) % count) - count / 2;
      const card = cards[i];
      if (Math.abs(offset) > 2.4 || (fade === 0 && i > 0)) {
        card.style.visibility = 'hidden';
        continue;
      }
      const side = Math.max(-1, Math.min(1, offset));
      const away = Math.abs(side);
      card.style.visibility = 'visible';
      card.style.zIndex = String(10 - Math.round(Math.abs(offset)));
      card.style.opacity = i === 0 ? '1' : fade.toFixed(3);
      // Neighbours sit smaller and lower, each leaning in toward the middle print.
      card.style.transform =
        `translate(-50%, -50%) translate(${(offset * gap).toFixed(1)}px, ${(rise + away * lift).toFixed(1)}px) ` +
        `rotate(${(-side * 12).toFixed(2)}deg) scale(${(1 - away * 0.14).toFixed(3)})`;
    }
    this.index.set(Math.min(last, Math.max(0, Math.round(position))));
  }

  /** Dragging sideways moves the page itself, so scroll and drag can't disagree. */
  dragStart(event: PointerEvent): void {
    if (this.scenes.reduced || event.button !== 0) return;
    const track = this.track().nativeElement;
    const perPixel = ((track.offsetHeight - innerHeight) * (1 - OPEN_END)) / ((this.prints.length - 1) * this.gap());
    let lastX = event.clientX;
    const move = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      window.scrollBy({ top: -dx * perPixel, behavior: 'instant' });
    };
    const end = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', end);
      removeEventListener('pointercancel', end);
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', end);
    addEventListener('pointercancel', end);
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
