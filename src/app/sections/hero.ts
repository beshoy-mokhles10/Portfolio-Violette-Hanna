import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IntroService } from '../core/intro.service';

const STRIP = ['LOGO', 'YOUR CLIENT', 'Logoipsum', 'BRAND', 'logo ipsum', 'YOUR CLIENT'];

/**
 * The opening plays by itself, with no scrolling needed, and is meant to be quiet.
 * Her name rises onto a soft peach page and a fine line is drawn beneath it. Then
 * both fade, and the page itself dissolves to uncover the photograph, which
 * settles from a slight zoom as the header comes in.
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
      <div class="hx__page" aria-hidden="true">
        <span class="hx__sig">Violette Hanna</span>
        <span class="hx__rule"></span>
      </div>
      <span class="hx__scroll" aria-hidden="true">Scroll</span>
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
        transform: scale(1.08);
        animation: hx-settle 4.4s var(--soft) 2.8s both;
      }
      @keyframes hx-settle {
        to {
          transform: scale(1);
        }
      }

      /* The peach page the name sits on. It dissolves, slowly, onto the photograph. */
      .hx__page {
        position: absolute;
        inset: 0;
        z-index: 3;
        display: grid;
        place-items: center;
        background: var(--bg);
        animation: hx-dissolve 2.4s var(--soft) 2.8s both;
      }
      @keyframes hx-dissolve {
        to {
          opacity: 0;
          visibility: hidden;
        }
      }
      .hx__sig {
        padding: 0.12em 0.22em 0.2em;
        font-family: 'Allura', cursive;
        font-size: clamp(60px, 15vw, 260px);
        line-height: 1;
        color: var(--brown);
        opacity: 0;
        animation:
          hx-rise 1.8s var(--soft) 0.3s both,
          hx-fade 1.4s var(--soft) 2.6s forwards;
      }
      @keyframes hx-rise {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      @keyframes hx-fade {
        to {
          opacity: 0;
        }
      }
      /* A fine line drawn under the name. */
      .hx__rule {
        position: absolute;
        left: 50%;
        top: calc(50% + clamp(50px, 7.6vw, 130px));
        width: min(24vw, 300px);
        height: 1px;
        margin-left: calc(min(24vw, 300px) / -2);
        background: linear-gradient(90deg, transparent, var(--brown) 20%, var(--brown) 80%, transparent);
        transform: scaleX(0);
        animation:
          hx-line 1.2s var(--soft) 1.2s both,
          hx-fade 1.2s var(--soft) 2.6s forwards;
      }
      @keyframes hx-line {
        to {
          transform: scaleX(1);
        }
      }

      /* A small cue, once the photograph is in. */
      .hx__scroll {
        position: absolute;
        left: 50%;
        bottom: 34px;
        z-index: 4;
        translate: -50% 0;
        color: #fff;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.4em;
        text-transform: uppercase;
        text-shadow: 0 1px 10px rgb(0 0 0 / 0.35);
        opacity: 0;
        animation: hx-cue 1s ease 5.2s both;
      }
      .hx__scroll::after {
        content: '';
        display: block;
        width: 1px;
        height: 34px;
        margin: 10px auto 0;
        background: currentColor;
        animation: hx-drip 2s ease-in-out 5.2s infinite;
      }
      @keyframes hx-cue {
        to {
          opacity: 0.85;
        }
      }
      @keyframes hx-drip {
        0% {
          transform: scaleY(0);
          transform-origin: top;
        }
        50% {
          transform: scaleY(1);
          transform-origin: top;
        }
        51% {
          transform-origin: bottom;
        }
        100% {
          transform: scaleY(0);
          transform-origin: bottom;
        }
      }

      /* Seen on returning to Home, and under reduced motion: just the photograph. */
      .no-intro .hx__page,
      .no-intro .hx__scroll {
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
        .hx__page,
        .hx__scroll {
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
