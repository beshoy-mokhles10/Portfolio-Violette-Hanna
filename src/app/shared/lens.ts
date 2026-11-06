import { ChangeDetectionStrategy, Component } from '@angular/core';

const FINE_RINGS = Array.from({ length: 14 }, (_, i) => 124 + i * 3.2);

/** A camera lens seen head-on, drawn in SVG, with engraved text and metal sheen that turn with its parent. */
@Component({
  selector: 'app-lens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <path id="lens-ring" d="M200 200 m-172 0 a172 172 0 1 1 344 0 a172 172 0 1 1 -344 0" />
        <radialGradient id="lens-body" cx="50%" cy="50%" r="50%">
          <stop offset="0.72" stop-color="color-mix(in srgb, var(--brown) 95%, #1a0f10)" />
          <stop offset="0.86" stop-color="color-mix(in srgb, var(--brown) 70%, #1a0f10)" />
          <stop offset="1" stop-color="color-mix(in srgb, var(--brown) 55%, #1a0f10)" />
        </radialGradient>
        <radialGradient id="lens-glass" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="color-mix(in srgb, var(--brown) 100%, #1a0f10)" />
          <stop offset="0.4" stop-color="color-mix(in srgb, var(--brown) 95%, #1a0f10)" />
          <stop offset="1" stop-color="color-mix(in srgb, var(--brown) 50%, #1a0f10)" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="199" fill="color-mix(in srgb, var(--brown) 45%, #1a0f10)" />
      <circle cx="200" cy="200" r="192" fill="url(#lens-body)" />
      <text class="eng">
        <textPath href="#lens-ring" startOffset="1%">50mm 1:1.8</textPath>
      </text>
      <text class="eng">
        <textPath href="#lens-ring" startOffset="31%">Ø58 mm</textPath>
      </text>
      <text class="eng">
        <textPath href="#lens-ring" startOffset="58%">VIOLETTE HANNA</textPath>
      </text>
      <circle cx="200" cy="200" r="157" fill="color-mix(in srgb, var(--brown) 55%, #1a0f10)" stroke="color-mix(in srgb, var(--brown) 100%, #1a0f10)" stroke-width="2" />
      @for (r of fine; track r) {
        <circle cx="200" cy="200" [attr.r]="r" fill="none" stroke="color-mix(in srgb, var(--brown) 85%, #1a0f10)" stroke-width="0.8" />
      }
      <circle cx="200" cy="200" r="104" fill="color-mix(in srgb, var(--brown) 70%, #1a0f10)" stroke="color-mix(in srgb, var(--brown) 30%, #1a0f10)" stroke-width="6" />
      <circle cx="200" cy="200" r="84" fill="color-mix(in srgb, var(--brown) 75%, #1a0f10)" stroke="color-mix(in srgb, var(--brown) 100%, #1a0f10)" stroke-width="1.500" />
      <circle cx="200" cy="200" r="68" fill="color-mix(in srgb, var(--brown) 60%, #1a0f10)" stroke="color-mix(in srgb, var(--brown) 30%, #1a0f10)" stroke-width="4" />
      <circle cx="200" cy="200" r="50" fill="url(#lens-glass)" stroke="color-mix(in srgb, var(--brown) 45%, #1a0f10)" stroke-width="2" />
    </svg>
    <span class="sheen" aria-hidden="true"></span>
  `,
  styles: [
    `
      :host {
        position: relative;
        display: block;
      }
      svg {
        display: block;
        width: 100%;
        height: auto;
      }
      .eng {
        fill: #eeeee8;
        font-family: var(--font-body);
        font-size: 19px;
        letter-spacing: 0.02em;
      }
      /* Metal catching the light, in two soft bands across the barrel. */
      .sheen {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: conic-gradient(
          from 20deg,
          rgb(255 255 255 / 0) 0deg,
          rgb(255 255 255 / 0.2) 28deg,
          rgb(255 255 255 / 0) 62deg,
          rgb(255 255 255 / 0) 180deg,
          rgb(255 255 255 / 0.2) 208deg,
          rgb(255 255 255 / 0) 244deg,
          rgb(255 255 255 / 0) 360deg
        );
        pointer-events: none;
      }
    `
  ]
})
export class Lens {
  readonly fine = FINE_RINGS;
}
