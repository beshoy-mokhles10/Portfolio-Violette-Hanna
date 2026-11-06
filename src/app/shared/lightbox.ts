import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, model, viewChild } from '@angular/core';
import { SmoothScrollService } from '../core/smooth-scroll.service';

export interface LightboxItem {
  image: string;
  alt: string;
  /** A short name for the caption; the alt text stands in when there is none. */
  title?: string;
}

/**
 * A photograph opened large over a darkened, softly blurred page, with its
 * caption signed beneath and its frame number counted off like a roll of film.
 * `index` is the open frame, or null while closed. Arrow keys, swipes and the
 * side arrows move through the set; Escape, the cross or the backdrop close it.
 */
@Component({
  selector: 'app-lightbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    @if (current(); as item) {
      <div
        class="lb"
        role="dialog"
        aria-modal="true"
        aria-label="Photograph viewer"
        data-lenis-prevent
        (click)="backdrop($event)"
        (pointerdown)="swipeStart($event)"
        (pointerup)="swipeEnd($event)">
        <button #close type="button" class="lb__x" aria-label="Close" (click)="shut()">&#10005;</button>
        <button type="button" class="lb__go lb__go--prev" aria-label="Previous photograph" (click)="step(-1)">&#8592;</button>
        <button type="button" class="lb__go lb__go--next" aria-label="Next photograph" (click)="step(1)">&#8594;</button>

        <figure class="lb__fig">
          @for (frame of [item]; track frame.image) {
            <img [src]="frame.image" [alt]="frame.alt" draggable="false" />
          }
          <figcaption>
            <span class="lb__cap">{{ item.title ?? item.alt }}</span>
            <span class="lb__count">Frame {{ pad(index()! + 1) }} / {{ pad(items().length) }}</span>
          </figcaption>
        </figure>
      </div>
    }
  `,
  styles: [
    `
      .lb {
        position: fixed;
        inset: 0;
        z-index: 200;
        display: grid;
        place-items: center;
        background: rgb(52 28 20 / 0.92);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        animation: lb-fade 0.4s ease both;
        touch-action: pan-y;
      }
      @keyframes lb-fade {
        from {
          opacity: 0;
        }
      }
      .lb__fig {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        margin: 0;
        padding-inline: 90px;
      }
      .lb__fig img {
        max-width: min(78vw, 1200px);
        max-height: 72vh;
        object-fit: contain;
        box-shadow: 0 30px 80px rgb(0 0 0 / 0.5);
        animation: lb-pop 0.55s var(--ease) both;
        user-select: none;
      }
      @keyframes lb-pop {
        from {
          opacity: 0;
          transform: scale(0.88) translateY(20px);
        }
      }
      figcaption {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        text-align: center;
      }
      .lb__cap {
        font-family: 'Allura', cursive;
        font-size: clamp(26px, 3vw, 38px);
        line-height: 1.1;
        color: #fff;
      }
      .lb__count {
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--tan);
      }
      button {
        display: grid;
        place-items: center;
        border: 0;
        border-radius: 50%;
        background: rgb(255 255 255 / 0.18);
        color: #fff;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      button:hover,
      button:focus-visible {
        background: var(--brown);
      }
      .lb__x {
        position: absolute;
        top: 22px;
        right: 26px;
        width: 42px;
        height: 42px;
        font-size: 18px;
      }
      .lb__go {
        position: absolute;
        top: 50%;
        width: 50px;
        height: 50px;
        margin-top: -25px;
        font-size: 22px;
      }
      .lb__go--prev {
        left: 24px;
      }
      .lb__go--next {
        right: 24px;
      }
      @media (max-width: 700px) {
        .lb__fig {
          padding-inline: 16px;
        }
        .lb__fig img {
          max-width: 92vw;
        }
        .lb__go {
          top: auto;
          bottom: 24px;
          margin: 0;
        }
        .lb__go--prev {
          left: calc(50% - 64px);
        }
        .lb__go--next {
          right: calc(50% - 64px);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .lb,
        .lb__fig img {
          animation: none;
        }
      }
    `
  ]
})
export class Lightbox {
  private readonly scroll = inject(SmoothScrollService);
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('close');

  readonly items = input.required<LightboxItem[]>();
  readonly index = model<number | null>(null);

  private opener: Element | null = null;
  private swipeX = 0;

  readonly current = () => {
    const i = this.index();
    return i === null ? null : (this.items()[i] ?? null);
  };

  constructor() {
    effect(() => {
      const i = this.index();
      if (i === null) return;
      this.preload(i + 1);
      this.preload(i - 1);
    });
    effect(() => {
      const open = this.index() !== null;
      if (open) {
        this.opener ??= document.activeElement;
        this.scroll.stop();
        document.documentElement.style.overflow = 'hidden';
        queueMicrotask(() => this.closeButton()?.nativeElement.focus());
      } else if (this.opener) {
        this.scroll.start();
        document.documentElement.style.overflow = '';
        (this.opener as HTMLElement).focus?.();
        this.opener = null;
      }
    });
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  step(by: number): void {
    const i = this.index();
    if (i === null) return;
    const total = this.items().length;
    this.index.set((i + by + total) % total);
  }

  shut(): void {
    this.index.set(null);
  }

  backdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lb')) this.shut();
  }

  onKey(event: KeyboardEvent): void {
    if (this.index() === null) return;
    if (event.key === 'Escape') this.shut();
    else if (event.key === 'ArrowRight') this.step(1);
    else if (event.key === 'ArrowLeft') this.step(-1);
  }

  swipeStart(event: PointerEvent): void {
    this.swipeX = event.clientX;
  }

  swipeEnd(event: PointerEvent): void {
    const dx = event.clientX - this.swipeX;
    if (event.pointerType === 'touch' && Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
  }

  private preload(i: number): void {
    const total = this.items().length;
    new Image().src = this.items()[(i + total) % total].image;
  }
}
