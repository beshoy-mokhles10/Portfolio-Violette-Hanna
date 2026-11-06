import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild
} from '@angular/core';
import { SceneService, span } from '../core/scene.service';
import { Forest } from '../shared/forest';

const LINES = [
  'I am a photographer who finds inspiration',
  'in people, places and the moments between them.',
  'Through my lens I capture portraits, weddings,',
  'products and landscapes, each with its own',
  'honest story.'
];

/**
 * The hills rise as this arrives. Two big words part and fade back, and the
 * sentence between them climbs up from the bottom of the screen, one line at a
 * time, sharpening as it reaches its place.
 */
@Component({
  selector: 'app-statement',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Forest],
  template: `
    <section id="about" class="st" #track>
      <div class="st__stage">
        <app-forest />
        <div class="st__words" aria-hidden="true">
          <span class="a">Real</span>
          <span class="b">Life</span>
        </div>
        <p class="st__text" #text>
          @for (line of lines; track $index) {
            <span>{{ line }} </span>
          }
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        --part: 0;
        --fade: 0;
      }
      .st {
        height: 260vh;
      }
      .st__stage {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
        display: grid;
        place-items: center;
        background: var(--bg);
      }
      .st__words {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.2em;
        font-family: var(--font-head);
        font-size: clamp(72px, 13.89vw, 240px);
        line-height: 1;
        letter-spacing: -0.02em;
        text-transform: uppercase;
        color: var(--display);
      }
      .st__words span {
        opacity: calc(1 - var(--fade) * 0.7);
      }
      .a {
        transform: translateX(calc(var(--part) * -24.9vw));
      }
      .b {
        transform: translateX(calc(var(--part) * 24.9vw));
      }
      .st__text {
        position: relative;
        z-index: 2;
        display: grid;
        justify-items: center;
        width: 40.3vw;
        text-align: center;
        font-family: var(--font-head);
        font-size: clamp(20px, 2.083vw, 30px);
        line-height: 1.4;
        letter-spacing: normal;
        text-transform: uppercase;
        color: var(--ink);
      }
      .st__text span {
        display: block;
        white-space: nowrap;
        opacity: 0;
        will-change: transform, opacity, filter;
      }

      @media (max-width: 860px) {
        .st__words {
          flex-direction: column;
          gap: 0;
          font-size: 30vw;
        }
        .a {
          transform: translateY(calc(var(--part) * -31svh));
        }
        .b {
          transform: translateY(calc(var(--part) * 31svh));
        }
        .st__text {
          width: calc(100% - 2 * var(--pad));
          font-size: clamp(17px, 4.7vw, 22px);
        }
        .st__text span {
          white-space: normal;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host {
          --part: 1;
          --fade: 1;
        }
        .st {
          height: auto;
        }
        .st__stage {
          position: relative;
        }
        .st__text span {
          opacity: 1;
        }
      }
    `
  ]
})
export class Statement {
  private readonly scenes = inject(SceneService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly text = viewChild.required<ElementRef<HTMLElement>>('text');

  readonly lines = LINES;

  constructor() {
    afterNextRender(() => {
      const style = this.host.nativeElement.style;
      const spans = this.text().nativeElement.children;
      const stop = this.scenes.track(this.track().nativeElement, (p) => {
        const rise = 1 - span(p, 0, 0.3);
        style.setProperty('--forest-a', `${(rise * 360).toFixed(1)}px`);
        style.setProperty('--forest-b', `${(rise * 300).toFixed(1)}px`);
        style.setProperty('--forest-c', `${(rise * 240).toFixed(1)}px`);
        style.setProperty('--part', span(p, 0, 0.42).toFixed(4));
        style.setProperty('--fade', span(p, 0.08, 0.44).toFixed(4));

        for (let i = 0; i < spans.length; i++) {
          const line = spans[i] as HTMLElement;
          const start = 0.212 + i * 0.048;
          const t = Math.min(1, Math.max(0, (p - start) / 0.2));
          line.style.opacity = t.toFixed(3);
          line.style.filter = t < 1 ? `blur(${((1 - t) * 7).toFixed(1)}px)` : 'none';
          line.style.transform = `translateY(${((1 - t) * innerHeight * 0.85).toFixed(1)}px)`;
        }
      });
      this.destroyRef.onDestroy(stop);
    });
  }
}
