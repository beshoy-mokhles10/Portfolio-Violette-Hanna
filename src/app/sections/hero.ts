import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IntroService } from '../core/intro.service';

const STRIP = ['LOGO', 'YOUR CLIENT', 'Logoipsum', 'BRAND', 'logo ipsum', 'YOUR CLIENT'];

/**
 * The opening plays by itself, with no scrolling needed. Her name is signed in
 * across a soft peach page, a fine line is drawn beneath it, and then the page
 * parts down the middle like a curtain, taking the name with it, to uncover the
 * photograph, which settles from a slight zoom as the header comes in.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="home" class="hx" [class.no-intro]="!play()">
      <img
        class="hx__img"
        src="assets/img/hero.jpg"
        alt="Violette Hanna crouching among a group of smiling girls, taking a selfie with her camera around her neck"
        fetchpriority="high" />

      <h1 class="sr-only">Violette Hanna</h1>
      <div class="hx__half hx__half--l" aria-hidden="true"><div class="hx__sig"><span>Violette Hanna</span></div></div>
      <div class="hx__half hx__half--r" aria-hidden="true"><div class="hx__sig"><span>Violette Hanna</span></div></div>
      <span class="hx__rule" aria-hidden="true"></span>
    </section>

    <div class="hx__strip" aria-hidden="true">
      <div>
        @for (logo of strip; track $index) {
          <span [class.alt]="$index % 3 === 2">{{ logo }}</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        /* One easing for the whole piece: slow in, long soft landing. */
        --soft: cubic-bezier(0.45, 0, 0.15, 1);
      }
      .hx {
        position: relative;
        height: 100svh;
        overflow: hidden;
        background: var(--bg);
      }
      .hx__img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.14);
        animation: hx-settle 3.4s cubic-bezier(0.33, 0, 0.1, 1) 3.5s both;
      }
      @keyframes hx-settle {
        to {
          transform: scale(1);
        }
      }

      /* The page, in two halves that each carry half of the signed name. */
      .hx__half {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%;
        overflow: hidden;
        z-index: 3;
        background: var(--bg);
        will-change: transform;
      }
      .hx__half--l {
        left: 0;
        animation: hx-part-l 2.6s var(--soft) 3.9s both;
      }
      .hx__half--r {
        right: 0;
        animation: hx-part-r 2.6s var(--soft) 3.9s both;
      }
      @keyframes hx-part-l {
        0% {
          transform: translateX(0);
          box-shadow: 0 0 0 0 rgb(70 30 20 / 0);
        }
        12% {
          box-shadow: 0 0 70px 6px rgb(70 30 20 / 0.28);
        }
        100% {
          transform: translateX(-104%);
          box-shadow: 0 0 70px 6px rgb(70 30 20 / 0.28);
        }
      }
      @keyframes hx-part-r {
        0% {
          transform: translateX(0);
          box-shadow: 0 0 0 0 rgb(70 30 20 / 0);
        }
        12% {
          box-shadow: 0 0 70px 6px rgb(70 30 20 / 0.28);
        }
        100% {
          transform: translateX(104%);
          box-shadow: 0 0 70px 6px rgb(70 30 20 / 0.28);
        }
      }
      .hx__sig {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100vw;
        display: grid;
        place-items: center;
        font-family: 'Allura', cursive;
        font-size: clamp(60px, 15vw, 260px);
        line-height: 1;
        color: var(--brown);
      }
      .hx__half--l .hx__sig {
        left: 0;
      }
      .hx__half--r .hx__sig {
        right: 0;
      }
      /* The name is written in by a soft-edged wipe, not a hard cut, so the strokes seem to be laid down. */
      .hx__sig span {
        display: block;
        padding: 0.12em 0.22em 0.2em;
        -webkit-mask: linear-gradient(90deg, #000 calc(100% - 0.7em), transparent) left / 0% 100% no-repeat;
        mask: linear-gradient(90deg, #000 calc(100% - 0.7em), transparent) left / 0% 100% no-repeat;
        animation: hx-write 2.9s cubic-bezier(0.4, 0, 0.25, 1) 0.5s both;
      }
      @keyframes hx-write {
        to {
          -webkit-mask-size: calc(100% + 0.7em) 100%;
          mask-size: calc(100% + 0.7em) 100%;
        }
      }
      /* A fine line drawn under the name, then gone before the page opens. */
      .hx__rule {
        position: absolute;
        left: 50%;
        top: calc(50% + clamp(30px, 5.4vw, 92px));
        z-index: 4;
        width: min(46vw, 620px);
        height: 1.5px;
        margin-left: calc(min(46vw, 620px) / -2);
        background: linear-gradient(90deg, transparent, var(--brown) 18%, var(--brown) 82%, transparent);
        transform: scaleX(0);
        transform-origin: left;
        animation:
          hx-line 1.5s cubic-bezier(0.4, 0, 0.2, 1) 2.3s both,
          hx-line-out 0.6s ease 3.55s forwards;
      }
      @keyframes hx-line {
        to {
          transform: scaleX(1);
        }
      }
      @keyframes hx-line-out {
        to {
          opacity: 0;
        }
      }

      /* Seen on returning to Home, and under reduced motion: just the photograph. */
      .no-intro .hx__half,
      .no-intro .hx__rule {
        display: none;
      }
      .no-intro .hx__img {
        animation: none;
        transform: none;
      }

      .hx__strip {
        overflow: hidden;
        background: var(--brown);
        color: var(--on-brown);
        height: 48px;
        display: flex;
        align-items: center;
      }
      .hx__strip div {
        display: flex;
        width: max-content;
        gap: clamp(60px, 7vw, 110px);
        animation: marquee 30s linear infinite;
      }
      .hx__strip span {
        font-family: var(--font-head);
        font-size: clamp(22px, 2.3vw, 32px);
        line-height: 1;
        letter-spacing: 0.1em;
        white-space: nowrap;
      }
      .hx__strip span.alt {
        font-family: var(--font-body);
        font-weight: 700;
        font-size: 20px;
        letter-spacing: 0;
        align-self: center;
      }

      @media (max-width: 720px) {
        .hx__sig {
          font-size: 19vw;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .hx__half,
        .hx__rule {
          display: none;
        }
        .hx__img,
        .hx__strip div {
          animation: none;
          transform: none;
        }
      }
    `
  ]
})
export class Hero {
  private readonly intro = inject(IntroService);
  /** Decided once per mount, so a re-render can't restart the sequence. */
  readonly play = signal(this.intro.begin());
  /** Repeated so the marquee loops without a seam. */
  readonly strip = [...STRIP, ...STRIP, ...STRIP, ...STRIP];
}
