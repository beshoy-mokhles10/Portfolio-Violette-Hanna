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
import { WALL } from '../data/work.data';
import { DragCursor } from '../shared/drag-cursor';
import { Reveal } from '../shared/reveal.directive';

const RING = WALL.slice(0, 10);
const STEP = 360 / RING.length;

/**
 * A curved wall of photographs seen from inside the curve: five stand on screen,
 * the middle one smallest and flat-on, the outer ones swinging large toward you
 * and cropped by the edge of the screen. Scrolling and dragging both turn it.
 */
@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragCursor, Reveal],
  template: `
    <section id="gallery" class="gl" #track>
      <div class="gl__stage" #stage (pointerdown)="dragStart($event)">
        <header class="section-head">
          <p class="eyebrow" appReveal>Real Moments</p>
          <h2 class="heading" appReveal="80">Every Story Through One Lens</h2>
        </header>
        <div class="gl__wall" #wall>
          @for (item of ring; track item.image) {
            <figure class="gl__card">
              <img [src]="item.image" [attr.alt]="item.alt" draggable="false" decoding="async" />
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
      .gl {
        height: 300vh;
      }
      .gl__stage {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
        padding-top: 172px;
        cursor: none;
        touch-action: pan-y;
        user-select: none;
      }
      .gl__wall {
        position: absolute;
        inset: 0;
      }
      .gl__card {
        position: absolute;
        left: 50%;
        top: 61.3%;
        margin: 0;
        width: 20.56vw;
        height: 15.97vw;
        margin: -7.985vw 0 0 -10.28vw;
        overflow: hidden;
        border-radius: 8px;
        will-change: transform;
      }
      .gl__card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
      }
      @media (max-width: 860px) {
        .gl__stage {
          cursor: auto;
          padding-top: 110px;
        }
        .gl__card {
          width: 44vw;
          height: 34vw;
          margin: -17vw 0 0 -22vw;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .gl {
          height: auto;
        }
        .gl__stage {
          position: relative;
          height: auto;
          padding-block: 80px;
          cursor: auto;
        }
        app-drag-cursor {
          display: none;
        }
        .gl__wall {
          position: relative;
          display: flex;
          gap: 14px;
          margin-top: 40px;
          padding-inline: 60px;
          overflow-x: auto;
        }
        .gl__card {
          position: relative;
          left: auto;
          top: auto;
          flex: none;
          margin: 0;
        }
      }
    `
  ]
})
export class Gallery {
  private readonly scenes = inject(SceneService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly wall = viewChild.required<ElementRef<HTMLElement>>('wall');

  readonly ring = RING;
  private scroll = 0;
  private dragged = 0;

  constructor() {
    afterNextRender(() => {
      const stop = this.scenes.track(this.track().nativeElement, (p) => {
        // Measured on the reference: one 36° step every 450px, the move taking 230px.
        const px = p * (this.track().nativeElement.offsetHeight - innerHeight);
        const s = Math.max(0, px - 120) / 450;
        const whole = Math.floor(s);
        const f = Math.min(1, (s - whole) / (230 / 450));
        this.scroll = (whole + f * f * (3 - 2 * f)) * STEP;
        this.layout();
      });
      this.destroyRef.onDestroy(stop);
    });
  }

  private layout(): void {
    const unit = (innerWidth > 860 ? innerWidth : innerWidth * 2.14) / 1440;
    const radius = 500 * unit;
    const camera = 1000 * unit;
    const cards = this.wall().nativeElement.children as HTMLCollectionOf<HTMLElement>;
    const turn = this.scroll + this.dragged;
    for (let i = 0; i < cards.length; i++) {
      // Wrapped into -180…180 so a card leaving one edge re-enters at the other.
      const theta = ((((i * STEP - turn) % 360) + 540) % 360) - 180;
      const card = cards[i];
      if (Math.abs(theta) > 96) {
        card.style.visibility = 'hidden';
        continue;
      }
      const rad = (theta * Math.PI) / 180;
      card.style.visibility = 'visible';
      card.style.transform = `perspective(${camera.toFixed(1)}px) translate3d(${(radius * Math.sin(rad)).toFixed(1)}px, 0, ${(radius * (1 - Math.cos(rad))).toFixed(1)}px) rotateY(${(-theta).toFixed(2)}deg)`;
    }
  }

  dragStart(event: PointerEvent): void {
    if (this.scenes.reduced || event.button !== 0) return;
    let lastX = event.clientX;
    const move = (e: PointerEvent) => {
      this.dragged -= (e.clientX - lastX) * 0.09;
      lastX = e.clientX;
      this.layout();
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
}
