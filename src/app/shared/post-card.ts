import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../data/posts.data';
import { SITE } from '../data/site.data';
import { Icon } from './icon';

/** One article teaser, on Home, the blog index, and under each article. */
@Component({
  selector: 'app-post-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RouterLink],
  template: `
    <article class="pc">
      <a class="pc__figure" [routerLink]="['/blogs', post().slug]" tabindex="-1" aria-hidden="true">
        <img [src]="post().image" alt="" loading="lazy" decoding="async" />
      </a>
      <div class="pc__body">
        <p class="pc__meta">
          <span>{{ post().date }} &nbsp;·&nbsp; {{ post().minutes }} min read</span>
          <span>By {{ author }}</span>
        </p>
        <h3>{{ post().category }}</h3>
        <p class="pc__excerpt">{{ post().excerpt }}</p>
        <a class="pc__more" [routerLink]="['/blogs', post().slug]" [attr.aria-label]="'Read more about ' + post().category">
          Read More <app-icon name="arrow" [size]="16" />
        </a>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .pc {
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--line);
        transition: box-shadow 0.45s ease;
      }
      .pc:hover {
        box-shadow: 8px 12px 28px -14px rgb(90 50 35 / 0.32);
      }
      .pc__figure {
        display: block;
        overflow: hidden;
        aspect-ratio: 420 / 250;
      }
      .pc__figure img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .pc__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
      }
      .pc__meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 4px 16px;
        width: 100%;
        padding-bottom: 14px;
        border-bottom: 1px solid var(--line);
        color: var(--muted);
      }
      h3 {
        margin-top: 14px;
        font-size: 30px;
        line-height: 36px;
      }
      .pc__excerpt {
        flex: 1;
        margin-block: 10px 16px;
        color: var(--muted);
      }
      .pc__more {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 2px;
        border-bottom: 1px solid var(--ink);
        transition: color 0.3s ease;
      }
      .pc__more app-icon {
        transition: transform 0.4s var(--ease);
      }
      .pc:hover .pc__more app-icon {
        transform: rotate(45deg);
      }
    `
  ]
})
export class PostCard {
  readonly post = input.required<Post>();
  readonly author = SITE.name;
}
