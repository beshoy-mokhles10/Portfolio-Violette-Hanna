import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { SceneService } from '../core/scene.service';
import { STEPS } from '../data/work.data';
import { Leaves } from '../shared/leaves';
import { Lens } from '../shared/lens';
import { Reveal } from '../shared/reveal.directive';

/**
 * Behind the frame: a lens turns as you scroll, with the current step's number
 * beside it and its neighbours fading above and below. The cards climb so the
 * current one always sits level with the middle of the lens.
 */
@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Leaves, Lens, Reveal],
  template: `
    <section id="process" class="pr" #track>
      <div class="pr__stage">
        <app-leaves class="pr__leaves" />
        <header class="pr__head">
          <p class="eyebrow" appReveal>Behind The Frame</p>
          <h2 class="heading" appReveal="80">What You Don’t See</h2>
        </header>

        <div class="pr__dial" aria-hidden="true">
          <div class="pr__lens" #lens><app-lens /></div>
          <span class="pr__ghost pr__ghost--up"><i></i><b>{{ pad(prev() + 1) }}</b></span>
          <span class="pr__ghost pr__ghost--down"><i></i><b>{{ pad(next() + 1) }}</b></span>
          <span class="pr__now"><i></i>{{ pad(active() + 1) }}</span>
        </div>

        <div class="pr__viewport">
          <ol class="pr__cards" #cards>
            @for (step of steps; track step.title; let i = $index) {
              <li class="pr__card" [class.is-active]="active() === i" [class.is-past]="active() > i">
                <div class="pr__card-head">
                  <h3>{{ step.title }}</h3>
                  <span>Step {{ pad(i + 1) }}</span>
                </div>
                <p>{{ step.text }}</p>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--bg-light);
        --lens: min(25.3vw, 40.500svh);
        --centre: 61.1%;
      }
      .pr {
        height: 340vh;
      }
      .pr__stage {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
      }
      .pr__leaves {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: clamp(120px, 15.3vw, 220px);
        transform: scaleX(-1);
      }
      .pr__head {
        position: absolute;
        top: 79px;
        left: 60px;
        z-index: 2;
      }
      .pr__head .heading {
        margin-top: 20px;
      }
      .pr__dial {
        position: absolute;
        left: 60px;
        top: var(--centre);
        width: var(--lens);
        height: var(--lens);
        transform: translateY(-50%);
      }
      .pr__lens {
        width: 100%;
        height: 100%;
        will-change: transform;
      }
      .pr__now {
        position: absolute;
        top: 50%;
        left: calc(100% + 13px);
        display: flex;
        align-items: center;
        gap: 16px;
        transform: translateY(-50%);
        font-family: var(--font-head);
        font-size: 48px;
        line-height: 48px;
        letter-spacing: -0.96px;
        color: var(--ink);
      }
      .pr__now i {
        display: block;
        width: 60px;
        height: 1px;
        background: var(--ink);
      }
      .pr__ghost {
        position: absolute;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        width: 60px;
        margin-left: -30px;
        font-family: var(--font-head);
        font-size: 48px;
        line-height: 1;
        color: var(--soft);
      }
      .pr__ghost i {
        display: block;
        width: 1px;
        height: 60px;
        background: var(--line);
      }
      .pr__ghost b {
        font-weight: 400;
      }
      .pr__ghost--up {
        bottom: calc(100% + 10px);
        flex-direction: column-reverse;
      }
      .pr__ghost--up b {
        transform: rotate(-48deg);
      }
      .pr__ghost--down {
        top: calc(100% + 10px);
      }
      .pr__ghost--down b {
        transform: rotate(38deg);
      }

      .pr__viewport {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 49vw;
        right: 60px;
      }
      .pr__cards {
        display: flex;
        flex-direction: column;
        gap: 25px;
        will-change: transform;
      }
      .pr__card {
        padding: 30px;
        border: 1px solid var(--line);
        color: var(--soft);
        transition:
          background-color 0.5s ease,
          color 0.5s ease,
          border-color 0.5s ease;
      }
      .pr__card-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        height: 72px;
        margin-bottom: 30px;
        border-bottom: 1px solid currentColor;
        border-bottom-color: rgb(120 120 100 / 0.25);
      }
      h3 {
        font-size: 30px;
        line-height: 42px;
        color: inherit;
      }
      .pr__card-head span {
        padding-top: 0;
        letter-spacing: 4.16px;
        text-transform: uppercase;
      }
      .pr__card p {
        text-align: justify;
        opacity: 0.8;
      }
      .pr__card.is-past {
        background: var(--past);
        border-color: var(--past);
        color: var(--on-past);
      }
      .pr__card.is-active {
        background: var(--brown);
        border-color: var(--brown);
        color: var(--on-brown);
      }
      .pr__card.is-active .pr__card-head,
      .pr__card.is-past .pr__card-head {
        border-bottom-color: rgb(255 255 255 / 0.22);
      }

      @media (max-width: 860px) {
        :host {
          --lens: min(38vw, 22svh);
        }
        .pr__stage {
          display: flex;
          flex-direction: column;
          padding: 79px var(--pad) 0;
        }
        .pr__head,
        .pr__dial,
        .pr__viewport {
          position: static;
          transform: none;
        }
        .pr__dial {
          position: relative;
          flex: none;
          margin: 26px auto 16px;
        }
        .pr__ghost {
          display: none;
        }
        .pr__viewport {
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .pr__card {
          padding: 16px 18px;
        }
        .pr__card-head {
          height: auto;
          margin-bottom: 12px;
          padding-bottom: 8px;
        }
        h3 {
          font-size: 26px;
          line-height: 30px;
        }
        .pr__now {
          font-size: 36px;
        }
        .pr__now i {
          width: 30px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .pr {
          height: auto;
        }
        .pr__stage {
          position: relative;
          height: auto;
          display: grid;
          gap: 30px;
          padding: 79px 60px 60px;
        }
        .pr__head,
        .pr__dial,
        .pr__viewport {
          position: static;
          transform: none;
        }
        .pr__ghost,
        .pr__now {
          display: none;
        }
      }
    `
  ]
})
export class Process {
  private readonly scenes = inject(SceneService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly lens = viewChild.required<ElementRef<HTMLElement>>('lens');
  private readonly cards = viewChild.required<ElementRef<HTMLElement>>('cards');

  readonly steps = STEPS;
  readonly active = signal(0);
  readonly prev = signal(STEPS.length - 1);
  readonly next = signal(1);

  constructor() {
    afterNextRender(() => {
      const stop = this.scenes.track(this.track().nativeElement, (p) => this.update(p));
      this.destroyRef.onDestroy(stop);
    });
  }

  private update(p: number): void {
    const count = this.steps.length;
    const last = count - 1;
    const f = Math.min(1, p / 0.94) * last;
    const near = Math.round(f);
    this.active.set(near);
    this.prev.set((near - 1 + count) % count);
    this.next.set((near + 1) % count);
    this.lens().nativeElement.style.transform = `rotate(${(-f * 90).toFixed(2)}deg)`;

    const list = this.cards().nativeElement;
    const items = list.children as HTMLCollectionOf<HTMLElement>;
    const low = Math.floor(f);
    const high = Math.min(last, low + 1);
    const centre = (i: number) => items[i].offsetTop - list.offsetTop + items[i].offsetHeight / 2;
    const y = centre(low) + (centre(high) - centre(low)) * (f - low);
    // Wide screens hold the current card level with the lens; on phones it sits
    // at the top of the small window under the lens.
    const anchor = innerWidth > 860 ? innerHeight * 0.611 : items[0].offsetHeight / 2;
    list.style.transform = `translateY(${(anchor - y).toFixed(1)}px)`;
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
