import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../core/seo.service';
import { POSTS } from '../data/posts.data';
import { SITE } from '../data/site.data';
import { PageHero } from '../shared/page-hero';
import { PostCard } from '../shared/post-card';
import { Reveal } from '../shared/reveal.directive';

const INTRO =
  'Notes from every kind of shoot: how to feel at ease in front of a camera, plan a wedding day around the light, prepare a product, and wait for a landscape.';

@Component({
  selector: 'app-blogs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, PostCard, Reveal],
  template: `
    <app-page-hero
      [crumbs]="[{ label: 'Home', link: '/' }, { label: 'Stories Behind The Lens' }]"
      heading="Every Picture Has A Moment"
      [text]="intro" />

    <section class="bg">
      <header class="section-head">
        <p class="eyebrow" appReveal>From The Field</p>
        <h2 class="heading" appReveal="80">Stories Beyond The Frame</h2>
      </header>
      <ul class="bg__grid">
        @for (post of posts; track post.slug; let i = $index) {
          <li [appReveal]="(i % 3) * 110"><app-post-card [post]="post" /></li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      .bg {
        padding: 80px var(--pad);
      }
      .bg__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 30px;
        margin-top: 44px;
      }
      @media (max-width: 900px) {
        .bg__grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `
  ]
})
export class Blogs {
  readonly posts = POSTS;
  readonly intro = INTRO;

  constructor() {
    inject(SeoService).update({ title: `Blog — ${SITE.name}`, description: INTRO, path: '/blogs' });
  }
}
