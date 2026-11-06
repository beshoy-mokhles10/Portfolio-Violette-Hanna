import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IntroService } from '../core/intro.service';
import { SeoService } from '../core/seo.service';
import { SITE } from '../data/site.data';
import { BlogSection } from '../sections/blog-section';
import { Collection } from '../sections/collection';
import { Gallery } from '../sections/gallery';
import { Hero } from '../sections/hero';
import { Process } from '../sections/process';
import { Statement } from '../sections/statement';
import { Story } from '../sections/story';
import { Testimonials } from '../sections/testimonials';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogSection, Collection, Gallery, Hero, Process, Statement, Story, Testimonials],
  template: `
    <!-- Re-created whenever the opening is replayed, so it starts again from its first frame. -->
    @for (run of [intro.run()]; track run) {
      <app-hero />
    }
    <app-statement />
    <app-story />
    <app-collection />
    <app-process />
    <app-gallery />
    <app-blog-section />
    <app-testimonials />
  `
})
export class Home {
  readonly intro = inject(IntroService);

  constructor() {
    inject(SeoService).update({
      title: `${SITE.name} — Portrait, Wedding, Commercial & Landscape Photographer`,
      description:
        'Violette Hanna is a photographer of portraits, weddings and events, products and commercial work, and nature and landscapes.',
      path: '/'
    });
  }
}
