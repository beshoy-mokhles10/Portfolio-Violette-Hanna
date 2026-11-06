import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild
} from '@angular/core';
import { SceneService } from '../core/scene.service';
import { TESTIMONIALS } from '../data/work.data';
import { Reveal } from '../shared/reveal.directive';

/** Spacing between cards, and how far each one steps down per pixel to the right. */
const GAP = 30;
const STAIR = 45 / 345;
const START_X = 80;
/** Where the last card stops, measured from the right edge of the screen. */
const END_RIGHT = 355;

const BAR_PITCH = 4.6;
const BAR_H = 10;
/** Bar heights beside the marker, nearest first: the ruler swells around it. */
const SWELL = [18, 14, 12];
const MARKER_H = 30;

/**
 * Cards walking down a staircase as scrolling carries them sideways, under a
 * fine ruler whose bars swell around a marker that shows how far along you are.
 */
@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="ts" #track aria-labelledby="ts-heading">
      <div class="ts__stage">
        <header class="section-head">
          <p class="eyebrow" appReveal>Testimonials</p>
          <h2 id="ts-heading" class="heading" appReveal="80">Trusted By The People In Frame</h2>
        </header>

        <canvas class="ts__ruler" #ruler aria-hidden="true"></canvas>

        <ul class="ts__row" #row>
          @for (item of items; track $index) {
            <li class="ts__card">
              <div class="ts__who">
                <img class="ts__avatar" [src]="item.avatar" alt="" loading="lazy" decoding="async" />
                <div>
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.role }}</p>
                </div>
              </div>
              <blockquote>{{ item.quote }}</blockquote>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--bg);
      }
      .ts {
        height: 374vh;
      }
      .ts__stage {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
        padding-top: 96px;
      }
      .section-head {
        gap: 19px;
      }
      .ts__ruler {
        position: absolute;
        left: 60px;
        right: 60px;
        top: 228px;
        width: calc(100% - 120px);
        height: 30px;
      }
      /* The row is cut at its top edge, so a card climbing past it slides under. */
      .ts__row {
        position: absolute;
        inset: 36.44svh 0 0;
        overflow: hidden;
      }
      .ts__card {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 40px;
        width: 315px;
        height: 364px;
        padding: 30px 20px;
        background: var(--bg-light);
        will-change: transform, filter, opacity;
        transition: background-color 0.5s ease;
      }
      .ts__card h3,
      .ts__card p,
      .ts__card blockquote {
        transition: color 0.5s ease;
      }
      /* The card at the marker is filled; the ones around it blur and fade away. */
      .ts__card--on {
        background: var(--brown);
      }
      .ts__card--on h3,
      .ts__card--on p,
      .ts__card--on blockquote {
        color: var(--on-brown);
      }
      .ts__who {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .ts__avatar {
        flex: none;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
      h3 {
        font-size: 30px;
        line-height: 30px;
      }
      .ts__who p {
        margin-top: 4px;
        color: var(--muted);
      }
      blockquote {
        margin: 0;
        font-family: var(--font-body) !important;
        font-style: normal !important;
        font-weight: 500 !important;
        letter-spacing: -0.32px !important;
        color: var(--muted);
        text-align: justify;
      }
      @media (max-width: 720px) {
        .ts__stage {
          padding-top: 84px;
        }
        .ts__ruler {
          left: var(--pad);
          right: var(--pad);
          width: calc(100% - 2 * var(--pad));
          top: 210px;
        }
        .ts__row {
          inset: 260px 0 0;
        }
        .ts__card {
          width: 78vw;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .ts {
          height: auto;
        }
        .ts__stage {
          position: relative;
          height: auto;
          padding-block: 80px;
        }
        .ts__ruler {
          display: none;
        }
        .ts__row {
          position: relative;
          inset: auto;
          display: flex;
          gap: 30px;
          margin-top: 40px;
          padding-inline: 60px;
          overflow-x: auto;
        }
        .ts__card {
          position: relative;
          flex: none;
        }
      }
    `
  ]
})
export class Testimonials {
  private readonly scenes = inject(SceneService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly row = viewChild.required<ElementRef<HTMLElement>>('row');
  private readonly ruler = viewChild.required<ElementRef<HTMLCanvasElement>>('ruler');

  readonly items = TESTIMONIALS;

  constructor() {
    afterNextRender(() => {
      const stop = this.scenes.track(this.track().nativeElement, (p) => this.layout(p));
      this.destroyRef.onDestroy(stop);
    });
  }

  private layout(p: number): void {
    this.drawRuler(p);
    const cards = this.row().nativeElement.children as HTMLCollectionOf<HTMLElement>;
    const pitch = cards[0].offsetWidth + GAP;
    const total = pitch * (cards.length - 1) + START_X - (innerWidth - END_RIGHT);
    const focus = p * (cards.length - 1);
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (let i = 0; i < cards.length; i++) {
      const x = START_X + i * pitch - p * total;
      const card = cards[i];
      card.style.transform = `translate3d(${x.toFixed(1)}px, ${(x * STAIR - 8).toFixed(1)}px, 0)`;
      if (calm) continue;
      const away = Math.min(Math.abs(i - focus), 1.6);
      card.style.filter = away < 0.15 ? '' : `blur(${(away * 3.2).toFixed(1)}px)`;
      card.style.opacity = (1 - away * 0.32).toFixed(2);
      card.classList.toggle('ts__card--on', Math.round(focus) === i);
    }
  }

  private drawRuler(p: number): void {
    const canvas = this.ruler().nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const css = getComputedStyle(canvas);
    const soft = css.getPropertyValue('--muted');
    const ink = css.getPropertyValue('--ink');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const count = Math.floor(width / BAR_PITCH);
    const at = p * count;
    for (let i = 0; i <= count; i++) {
      const away = Math.abs(i - at);
      const near = Math.round(away);
      const barH = near < SWELL.length ? SWELL[near] : BAR_H;
      ctx.globalAlpha = near < SWELL.length ? 0.75 : 0.42;
      ctx.fillStyle = soft;
      ctx.fillRect(i * BAR_PITCH, height - barH, 2, barH);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink;
    ctx.fillRect(at * BAR_PITCH, height - MARKER_H, 2, MARKER_H);
  }
}
