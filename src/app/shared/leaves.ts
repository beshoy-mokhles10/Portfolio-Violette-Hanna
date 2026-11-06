import { ChangeDetectionStrategy, Component } from '@angular/core';

const BLOOMS = [
  { x: 236, y: 30, s: 1.25, alt: false }, { x: 172, y: 26, s: .95, alt: true }, { x: 112, y: 40, s: .8, alt: false },
  { x: 268, y: 92, s: 1.05, alt: true }, { x: 262, y: 160, s: .85, alt: false }, { x: 200, y: 84, s: .78, alt: false }
];
const PETALS = [0, 72, 144, 216, 288].map((a) => `rotate(${a})`);

/** A spray of small flowers hanging into a section's top corner. */
@Component({
  selector: 'app-leaves',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 300 230" aria-hidden="true">
      <path class="tw" d="M300 0 C250 22 170 18 112 40" />
      <path class="tw" d="M300 8 C282 60 276 110 262 160" />
      <path class="tw" d="M292 6 C260 34 230 60 200 84" />
      @for (b of blooms; track $index) {
        <g [attr.transform]="'translate(' + b.x + ' ' + b.y + ') scale(' + b.s + ')'" [attr.class]="b.alt ? 'alt' : ''">
          @for (p of petals; track $index) { <ellipse cx="0" cy="-13" rx="9" ry="14" [attr.transform]="p" /> }
          <circle r="5.500" />
        </g>
      }
    </svg>
  `,
  styles: [`
    :host { display: block; pointer-events: none; }
    svg { display: block; width: 100%; height: auto; overflow: visible; }
    .tw { fill: none; stroke: var(--stem); stroke-width: 1.500; }
    ellipse { fill: var(--bloom-a); }
    .alt ellipse { fill: var(--bloom-b); }
    circle { fill: var(--heart); }
  `]
})
export class Leaves {
  readonly blooms = BLOOMS;
  readonly petals = PETALS;
}
