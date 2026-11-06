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
          <stop offset="0.72" stop-color="color-mix(in srgb, #4a4a4d 95%, #050505)" />
          <stop offset="0.86" stop-color="color-mix(in srgb, #4a4a4d 70%, #050505)" />
          <stop offset="1" stop-color="color-mix(in srgb, #4a4a4d 55%, #050505)" />
        </radialGradient>
        <radialGradient id="lens-glass" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="color-mix(in srgb, #4a4a4d 100%, #050505)" />
          <stop offset="0.4" stop-color="color-mix(in srgb, #4a4a4d 95%, #050505)" />
          <stop offset="1" stop-color="color-mix(in srgb, #4a4a4d 50%, #050505)" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="199" fill="color-mix(in srgb, #4a4a4d 45%, #050505)" />
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
      <circle cx="200" cy="200" r="157" fill="color-mix(in srgb, #4a4a4d 55%, #050505)" stroke="color-mix(in srgb, #4a4a4d 100%, #050505)" stroke-width="2" />
      @for (r of fine; track r) {
        <circle cx="200" cy="200" [attr.r]="r" fill="none" stroke="color-mix(in srgb, #4a4a4d 85%, #050505)" stroke-width="0.8" />
      }
      <circle cx="200" cy="200" r="104" fill="color-mix(in srgb, #4a4a4d 70%, #050505)" stroke="color-mix(in srgb, #4a4a4d 30%, #050505)" stroke-width="6" />
      <circle cx="200" cy="200" r="84" fill="color-mix(in srgb, #4a4a4d 75%, #050505)" stroke="color-mix(in srgb, #4a4a4d 100%, #050505)" stroke-width="1.500" />
      <circle cx="200" cy="200" r="68" fill="color-mix(in srgb, #4a4a4d 60%, #050505)" stroke="color-mix(in srgb, #4a4a4d 30%, #050505)" stroke-width="4" />
      <circle cx="200" cy="200" r="50" fill="url(#lens-glass)" stroke="color-mix(in srgb, #4a4a4d 45%, #050505)" stroke-width="2" />
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
