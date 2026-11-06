import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE } from '../data/site.data';

/** Her logo: her name as a signature, as if signed on a print. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ name }}`,
  styles: [
    `
      :host {
        display: inline-block;
        padding-inline: 2px;
        font-family: 'Allura', cursive;
        font-size: 26px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.1;
        letter-spacing: 0;
        white-space: nowrap;
      }
    `
  ]
})
export class Logo {
  readonly name = SITE.name;
}
