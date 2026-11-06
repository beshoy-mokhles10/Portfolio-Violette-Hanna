import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POSTS } from '../data/posts.data';
import { Icon } from '../shared/icon';
import { PostCard } from '../shared/post-card';
import { Reveal } from '../shared/reveal.directive';

/** Three articles and a way through to the rest. */
@Component({
  selector: 'app-blog-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PostCard, Reveal, RouterLink],
  template: `
    <section id="blogs" class="bs">
      <header class="section-head">
        <p class="eyebrow" appReveal>From The Field</p>
        <h2 class="heading" appReveal="80">Stories Beyond The Frame</h2>
      </header>
      <ul class="bs__grid">
        @for (post of posts; track post.slug; let i = $index) {
          <li [appReveal]="i * 110"><app-post-card [post]="post" /></li>
        }
      </ul>
      <a class="plank bs__all" routerLink="/blogs" appReveal>View All <app-icon name="leaf" /></a>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--bg-light);
      }
      .bs {
        display: grid;
        justify-items: center;
        padding: 79px 60px 80px;
      }
      .bs__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 30px;
        width: 100%;
        margin-block: 50px 44px;
      }
      @media (max-width: 900px) {
        .bs__grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `
  ]
})
export class BlogSection {
  readonly posts = POSTS.slice(0, 3);
}
