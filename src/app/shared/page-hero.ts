import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Forest } from './forest';

export interface Crumb {
  label: string;
  link?: string;
}

/** The opening of every inner page: a breadcrumb, a heading and one line, standing in the forest. */
@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Forest, RouterLink],
  template: `
    <section class="ph">
      <app-forest />
      <div class="ph__copy">
        <nav class="ph__crumbs" aria-label="Breadcrumb">
          @for (crumb of crumbs(); track crumb.label; let last = $last) {
            @if (crumb.link) {
              <a [routerLink]="crumb.link">{{ crumb.label }}</a>
            } @else {
              <span [attr.aria-current]="last ? 'page' : null">{{ crumb.label }}</span>
            }
            @if (!last) {
              <i aria-hidden="true">/</i>
            }
          }
        </nav>
        <h1>{{ heading() }}</h1>
        <p>{{ text() }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ph {
        position: relative;
        display: grid;
        place-items: start center;
        height: 900px;
        max-height: 100svh;
        min-height: 620px;
        padding-top: clamp(150px, 39vh, 350px);
        overflow: hidden;
        background: var(--bg);
      }
      .ph__copy {
        position: relative;
        z-index: 1;
        display: grid;
        justify-items: center;
        gap: 16px;
        width: min(100% - 2 * var(--pad), 640px);
        text-align: center;
      }
      .ph__crumbs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        letter-spacing: 4.16px;
        text-transform: uppercase;
      }
      .ph__crumbs a,
      .ph__crumbs i {
        color: var(--muted);
        font-style: normal;
      }
      .ph__crumbs a:hover {
        color: var(--brown);
      }
      h1 {
        font-size: clamp(44px, 3.61vw, 52px);
        line-height: 1.2;
        letter-spacing: -0.02em;
        white-space: normal;
      }
      p {
        max-width: 56ch;
        color: var(--muted);
      }
    `
  ]
})
export class PageHero {
  readonly crumbs = input.required<Crumb[]>();
  readonly heading = input.required<string>();
  readonly text = input.required<string>();
}
