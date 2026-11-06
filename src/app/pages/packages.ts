import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { SITE } from '../data/site.data';
import { EVERY_SESSION, FAQ, PACKAGES } from '../data/work.data';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';
import { Reveal } from '../shared/reveal.directive';

const INTRO = 'Three simple ways to work together. Each one is planned around you, and every message is answered personally.';

/** Sessions and prices, what every session includes, common questions and a way to book. */
@Component({
  selector: 'app-packages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PageHero, Reveal, RouterLink],
  template: `
    <app-page-hero [crumbs]="[{ label: 'Home', link: '/' }, { label: 'Packages' }]" heading="Sessions &amp; Packages" [text]="intro" />

    <section class="pk">
      <header class="section-head">
        <p class="eyebrow" appReveal>Choose Your Session</p>
        <h2 class="heading" appReveal="80">Made To Fit Your Story</h2>
      </header>

      <ul class="pk__grid">
        @for (pack of packages; track pack.name; let i = $index) {
          <li class="pk__card" [class.is-featured]="pack.featured" [appReveal]="i * 110">
            @if (pack.featured) {
              <span class="pk__tag">Most booked</span>
            }
            <h3>{{ pack.name }}</h3>
            <p class="pk__tagline">{{ pack.tagline }}</p>
            <p class="pk__price">{{ pack.price }}</p>
            <p class="pk__length">{{ pack.length }}</p>
            <ul class="pk__list">
              @for (feature of pack.features; track feature) {
                <li><app-icon name="check" [size]="16" /> {{ feature }}</li>
              }
            </ul>
            <a class="pk__btn" routerLink="/contact-us">Book this session</a>
          </li>
        }
      </ul>
      <p class="pk__note" appReveal>Weddings and commercial work are quoted individually. <a routerLink="/contact-us">Tell me about yours.</a></p>
    </section>

    <section class="pe">
      <header class="section-head">
        <p class="eyebrow" appReveal>Every Session</p>
        <h2 class="heading" appReveal="80">What You Always Get</h2>
      </header>
      <ul class="pe__row">
        @for (item of every; track item.title; let i = $index) {
          <li [appReveal]="i * 90">
            <span class="pe__n">{{ i + 1 }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </li>
        }
      </ul>
    </section>

    <section class="fq">
      <header class="section-head">
        <p class="eyebrow" appReveal>Questions</p>
        <h2 class="heading" appReveal="80">Before You Book</h2>
      </header>
      <div class="fq__list" appReveal="120">
        @for (item of faq; track item.q) {
          <details>
            <summary>{{ item.q }}</summary>
            <p>{{ item.a }}</p>
          </details>
        }
      </div>
    </section>

    <section class="cta">
      <h2 class="heading" appReveal>Ready When You Are</h2>
      <p appReveal="80">Send a request and I will reply within 24 hours.</p>
      <a class="pk__btn pk__btn--on" routerLink="/contact-us" appReveal="140">Book a session</a>
      <p class="cta__alt" appReveal="200">or write to <a [href]="'mailto:' + site.email">{{ site.email }}</a></p>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .pk,
      .pe,
      .fq {
        padding: 80px var(--pad);
      }
      .pe {
        background: var(--bg-light);
      }
      .pk__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 28px;
        align-items: stretch;
        max-width: 1180px;
        margin: 56px auto 0;
        list-style: none;
      }
      .pk__card {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 40px 34px 34px;
        background: var(--bg-light);
        border: 1px solid var(--line);
        border-radius: 6px;
        transition:
          transform 0.5s var(--ease),
          box-shadow 0.5s var(--ease);
      }
      .pk__card:hover {
        transform: translateY(-6px);
        box-shadow: 0 22px 44px -22px rgb(79 47 40 / 0.35);
      }
      .pk__card.is-featured {
        background: var(--brown);
        border-color: var(--brown);
        color: var(--on-brown);
        transform: translateY(-14px);
      }
      .pk__card.is-featured:hover {
        transform: translateY(-20px);
      }
      .pk__tag {
        position: absolute;
        top: -13px;
        left: 34px;
        padding: 5px 14px;
        border-radius: 999px;
        background: var(--ink);
        color: #fff;
        font-size: 12px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      h3 {
        font-size: 30px;
        line-height: 1.1;
      }
      .pk__tagline {
        margin-top: 8px;
        color: var(--muted);
      }
      .pk__price {
        margin-top: 26px;
        font-family: var(--head);
        font-style: italic;
        font-size: 42px;
        line-height: 1;
        color: var(--brown);
      }
      .pk__length {
        margin-top: 6px;
        font-size: 14px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .is-featured .pk__tagline,
      .is-featured .pk__price,
      .is-featured .pk__length,
      .is-featured h3 {
        color: var(--on-brown);
      }
      .is-featured .pk__tagline,
      .is-featured .pk__length {
        opacity: 0.85;
      }
      .pk__list {
        display: grid;
        gap: 12px;
        margin: 28px 0 34px;
        padding-top: 26px;
        border-top: 1px solid var(--line);
        list-style: none;
      }
      .is-featured .pk__list {
        border-color: rgb(255 255 255 / 0.3);
      }
      .pk__list li {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .pk__list svg {
        flex: none;
        color: var(--brown);
      }
      .is-featured .pk__list svg {
        color: var(--on-brown);
      }
      .pk__btn {
        display: inline-block;
        margin-top: auto;
        padding: 14px 26px;
        border-radius: 6px;
        background: var(--brown);
        color: var(--on-brown);
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: -0.2px;
        transition: background-color 0.3s ease;
      }
      .pk__btn:hover {
        background: var(--brown-dark);
      }
      .is-featured .pk__btn,
      .pk__btn--on {
        background: var(--on-brown);
        color: var(--brown);
      }
      .is-featured .pk__btn:hover,
      .pk__btn--on:hover {
        background: var(--bg);
      }
      .pk__note {
        margin-top: 44px;
        text-align: center;
        color: var(--muted);
      }
      .pk__note a,
      .cta__alt a {
        color: var(--brown);
        text-decoration: underline;
        text-underline-offset: 4px;
      }

      .pe__row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 36px;
        max-width: 1180px;
        margin: 52px auto 0;
        list-style: none;
      }
      .pe__row li {
        padding-top: 22px;
        border-top: 1px solid var(--line);
      }
      .pe__n {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--bg-deep);
        color: var(--brown);
        font-weight: 700;
      }
      .pe__row h3 {
        margin-top: 18px;
        font-size: 26px;
      }
      .pe__row p {
        margin-top: 8px;
        color: var(--muted);
      }

      .fq__list {
        max-width: 820px;
        margin: 48px auto 0;
        border-top: 1px solid var(--line);
      }
      details {
        border-bottom: 1px solid var(--line);
      }
      summary {
        position: relative;
        padding: 22px 44px 22px 4px;
        font-family: var(--head);
        font-style: italic;
        font-size: 24px;
        color: var(--ink);
        cursor: pointer;
        list-style: none;
        transition: color 0.3s ease;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: '+';
        position: absolute;
        right: 6px;
        top: 50%;
        translate: 0 -50%;
        font-family: var(--font-body);
        font-style: normal;
        font-size: 28px;
        color: var(--brown);
        transition: rotate 0.35s var(--ease);
      }
      details[open] summary::after {
        rotate: 45deg;
      }
      summary:hover {
        color: var(--brown);
      }
      details p {
        padding: 0 44px 24px 4px;
        color: var(--muted);
      }

      .cta {
        display: grid;
        justify-items: center;
        gap: 16px;
        padding: 90px var(--pad);
        background: var(--brown);
        color: var(--on-brown);
        text-align: center;
      }
      .cta .heading {
        color: var(--on-brown);
      }
      .cta .pk__btn {
        margin-top: 10px;
      }
      .cta__alt {
        font-size: 14px;
        opacity: 0.9;
      }
      .cta__alt a {
        color: var(--on-brown);
      }

      @media (max-width: 960px) {
        .pk__grid {
          grid-template-columns: minmax(0, 1fr);
          max-width: 520px;
        }
        .pk__card.is-featured {
          transform: none;
        }
        .pk__card.is-featured:hover {
          transform: translateY(-6px);
        }
        .pe__row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 560px) {
        .pe__row {
          grid-template-columns: minmax(0, 1fr);
        }
        summary {
          font-size: 21px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .pk__card,
        summary::after {
          transition: none;
        }
      }
    `
  ]
})
export class Packages {
  readonly site = SITE;
  readonly intro = INTRO;
  readonly packages = PACKAGES;
  readonly every = EVERY_SESSION;
  readonly faq = FAQ;

  constructor() {
    inject(SeoService).update({
      title: `Packages — ${SITE.name}`,
      description: INTRO,
      path: '/packages',
      image: 'og-image.jpg'
    });
  }
}
