import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { SeoService } from '../core/seo.service';
import { SmoothScrollService } from '../core/smooth-scroll.service';
import { POSTS, Post } from '../data/posts.data';
import { SITE } from '../data/site.data';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';
import { PostCard } from '../shared/post-card';
import { Reveal } from '../shared/reveal.directive';

/** One article: cover, sticky contents, numbers, a pull quote, rules to follow, and three more to read. */
@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PageHero, PostCard, Reveal],
  template: `
    @if (post(); as p) {
      <app-page-hero
        [crumbs]="[{ label: 'Home', link: '/' }, { label: 'Blogs', link: '/blogs' }, { label: p.category }]"
        [heading]="p.category"
        [text]="p.excerpt" />

      <div class="bp">
        <img class="bp__cover" [src]="p.image" alt="" decoding="async" appReveal />

        <p class="bp__byline">
          <span class="bp__avatar" aria-hidden="true">V</span>
          <b>{{ author }}</b>
          <i aria-hidden="true"></i>{{ p.date }} <i aria-hidden="true"></i>{{ p.minutes }} min read
        </p>

        <div class="bp__layout">
          <article>
            <div id="intro" class="bp__intro">
              @for (para of p.intro; track $index) {
                <p>{{ para }}</p>
              }
            </div>

            <ul class="bp__stats">
              @for (stat of p.stats; track stat.label) {
                <li>
                  <b>{{ stat.value }}</b>
                  <span>{{ stat.label }}</span>
                </li>
              }
            </ul>

            <img class="bp__inset" [src]="p.inset" alt="" loading="lazy" decoding="async" appReveal />

            @for (section of p.sections; track section.heading; let i = $index) {
              <section [id]="'part-' + i" class="bp__section">
                <h2>{{ section.heading }}</h2>
                <p>{{ section.text }}</p>
                @if (i === 0) {
                  <blockquote>
                    {{ p.quote }}
                    <cite>- {{ author }}</cite>
                  </blockquote>
                }
                @if (section.rules; as rules) {
                  <h3>{{ section.rulesTitle }}</h3>
                  <ul class="bp__rules">
                    @for (rule of rules; track rule) {
                      <li><app-icon name="check" [size]="20" />{{ rule }}</li>
                    }
                  </ul>
                }
              </section>
            }
          </article>

          <aside class="bp__toc">
            <p class="eyebrow">In This Story</p>
            <ol>
              <li>
                <button type="button" (click)="jump('intro')"><b>01</b> Introduction</button>
              </li>
              @for (section of p.sections; track section.heading; let i = $index) {
                <li>
                  <button type="button" (click)="jump('part-' + i)"><b>{{ '0' + (i + 2) }}</b> {{ section.heading }}</button>
                </li>
              }
            </ol>
          </aside>
        </div>

        <section class="bp__more">
          <header class="section-head">
            <p class="eyebrow">More To Discover</p>
            <h2 class="heading">Explore More Blogs</h2>
          </header>
          <ul>
            @for (other of more(); track other.slug) {
              <li><app-post-card [post]="other" /></li>
            }
          </ul>
        </section>
      </div>
    }
  `,
  styles: [
    `
      .bp {
        padding: 80px var(--pad);
      }
      .bp__cover {
        width: 100%;
        aspect-ratio: 16 / 8;
        object-fit: cover;
      }
      .bp__byline {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px 14px;
        margin-block: 28px 44px;
        font-size: 15px;
      }
      .bp__byline b {
        font-family: var(--font-head);
        font-size: 20px;
        font-weight: 400;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
      .bp__byline i {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--ink);
      }
      .bp__avatar {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--brown);
        color: var(--on-brown);
        font-family: var(--font-head);
      }
      .bp__layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 32%);
        gap: clamp(28px, 4vw, 48px);
        align-items: start;
      }
      article {
        color: var(--muted);
      }
      .bp__intro p + p {
        margin-top: 16px;
      }
      .bp__stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
        margin-block: 28px;
        padding-bottom: 28px;
        border-bottom: 1px solid var(--line);
      }
      .bp__stats li {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 24px 12px;
        background: var(--bg-light);
        text-align: center;
        font-size: 14px;
      }
      .bp__stats b {
        font-family: var(--font-head);
        font-size: 34px;
        font-weight: 400;
        line-height: 1;
        color: var(--ink);
      }
      .bp__inset {
        width: 100%;
        aspect-ratio: 2 / 1;
        object-fit: cover;
        margin-bottom: 28px;
      }
      .bp__section + .bp__section {
        margin-top: 44px;
        padding-top: 44px;
        border-top: 1px solid var(--line);
      }
      .bp__section h2 {
        margin-bottom: 18px;
        font-size: clamp(32px, 3.4vw, 48px);
        color: var(--ink);
      }
      .bp__section h3 {
        margin-block: 26px 14px;
        font-size: 22px;
        color: var(--ink);
      }
      blockquote {
        margin: 28px 0 0;
        padding: 28px;
        background: var(--brown);
        color: var(--on-brown);
        font-family: var(--font-head);
        font-size: clamp(24px, 2.4vw, 34px);
        line-height: 1.24;
        text-transform: uppercase;
      }
      cite {
        display: block;
        margin-top: 16px;
        font-family: var(--font-body);
        font-size: 15px;
        font-style: normal;
        text-transform: none;
      }
      .bp__rules li {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }
      .bp__rules app-icon {
        color: var(--brown);
      }
      .bp__toc {
        position: sticky;
        top: 90px;
        padding: 26px 28px;
        background: var(--bg-light);
      }
      .bp__toc ol {
        margin-top: 18px;
      }
      .bp__toc li {
        border-top: 1px solid var(--line);
      }
      .bp__toc button {
        display: flex;
        gap: 12px;
        width: 100%;
        padding: 12px 0;
        border: 0;
        background: none;
        font-family: var(--font-head);
        font-size: 19px;
        letter-spacing: 0.02em;
        text-align: start;
        text-transform: uppercase;
        cursor: pointer;
      }
      .bp__toc b {
        font-weight: 400;
      }
      .bp__toc button:hover {
        color: var(--brown);
      }
      .bp__more {
        margin-top: 100px;
      }
      .bp__more ul {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 28px;
        margin-top: 40px;
      }
      @media (max-width: 900px) {
        .bp__layout,
        .bp__more ul {
          grid-template-columns: minmax(0, 1fr);
        }
        .bp__toc {
          position: static;
          grid-row: 1;
        }
      }
      @media (max-width: 560px) {
        .bp__stats {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `
  ]
})
export class BlogPost {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly smooth = inject(SmoothScrollService);

  readonly author = SITE.name;
  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))));
  readonly post = computed<Post | undefined>(() => POSTS.find((p) => p.slug === this.slug()));
  readonly more = computed(() => POSTS.filter((p) => p.slug !== this.slug()).slice(0, 3));

  constructor() {
    effect(() => {
      const post = this.post();
      if (!post) {
        this.router.navigateByUrl('/blogs');
        return;
      }
      this.seo.update({
        title: `${post.category} — ${SITE.name}`,
        description: post.excerpt,
        path: `/blogs/${post.slug}`,
        image: post.image
      });
    });
  }

  jump(id: string): void {
    this.smooth.scrollTo(id);
  }
}
