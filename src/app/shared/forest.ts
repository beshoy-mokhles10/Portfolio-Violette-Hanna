import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Bloom { x: number; y: number; r: number; stem: string; petals: string[]; alt: boolean; }

function makeBlooms(count: number, seed: number, base: number, min: number, max: number): Bloom[] {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  return Array.from({ length: count }, () => {
    const x = rnd() * 1640 - 20;
    const height = min + rnd() * (max - min);
    const lean = (rnd() - 0.5) * 46;
    const tipX = x + lean;
    const tipY = base - height;
    const r = 9 + rnd() * 12;
    const n = rnd() > 0.5 ? 5 : 6;
    const petals = Array.from({ length: n }, (_, k) => `rotate(${(k * 360) / n})`);
    return { x: tipX, y: tipY, r, alt: rnd() > 0.55, petals, stem: `M${x.toFixed(1)} ${base + 40} Q${(x + lean * 0.2).toFixed(1)} ${(base - height * 0.55).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}` };
  });
}

const BACK = makeBlooms(50, 91, 880, 50, 150);
const FRONT = makeBlooms(44, 1337, 960, 40, 120);

/** Soft hills with wildflowers growing along them, in the theme's own colours. */
@Component({
  selector: 'app-forest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="f f--far" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path class="h" d="M0 760 C260 690 480 800 800 750 S1320 680 1600 760 V1000 H0Z" />
    </svg>
    <svg class="f f--mid" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path class="h" d="M0 860 C300 800 560 900 860 850 S1340 800 1600 870 V1000 H0Z" />
      @for (b of back; track $index) {
        <path class="st" [attr.d]="b.stem" />
        <g [attr.transform]="'translate(' + b.x + ' ' + b.y + ') scale(' + b.r / 14 + ')'" [attr.class]="b.alt ? 'bl alt' : 'bl'">
          @for (p of b.petals; track $index) { <ellipse cx="0" cy="-10" rx="6.500" ry="10" [attr.transform]="p" /> }
          <circle class="ht" r="4" />
        </g>
      }
    </svg>
    <svg class="f f--near" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path class="h" d="M0 950 C340 910 660 980 980 940 S1420 920 1600 955 V1000 H0Z" />
      @for (b of front; track $index) {
        <path class="st" [attr.d]="b.stem" />
        <g [attr.transform]="'translate(' + b.x + ' ' + b.y + ') scale(' + (b.r / 11) + ')'" [attr.class]="b.alt ? 'bl alt' : 'bl'">
          @for (p of b.petals; track $index) { <ellipse cx="0" cy="-10" rx="6.500" ry="10" [attr.transform]="p" /> }
          <circle class="ht" r="4" />
        </g>
      }
    </svg>
  `,
  styles: [`
    :host { position: absolute; inset: 0; display: block; overflow: hidden; pointer-events: none; }
    .f { position: absolute; inset: 0; width: 100%; height: 100%; will-change: transform; }
    .f--far { transform: translateY(var(--forest-a, 0)); }
    .f--mid { transform: translateY(var(--forest-b, 0)); }
    .f--near { transform: translateY(var(--forest-c, 0)); }
    .f--far .h { fill: var(--f-far); }
    .f--mid .h { fill: var(--f-mid); }
    .f--near .h { fill: var(--forest-near); }
    .st { fill: none; stroke: var(--stem); stroke-width: 2; opacity: .7; }
    .bl ellipse { fill: var(--bloom-a); opacity: .9; }
    .bl.alt ellipse { fill: var(--bloom-b); }
    .ht { fill: var(--heart); }
  `]
})
export class Forest {
  readonly back = BACK;
  readonly front = FRONT;
}
