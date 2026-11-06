import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../core/seo.service';
import { SITE } from '../data/site.data';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';
import { Reveal } from '../shared/reveal.directive';
import { BookingForm } from './booking-form';

const INTRO = 'Have a shoot in mind or a print to order? Write to me and every message will be answered personally.';

/** A card with Violette on one side and the booking form on the other, and her details beneath. */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingForm, Icon, PageHero, Reveal],
  template: `
    <app-page-hero [crumbs]="[{ label: 'Home', link: '/' }, { label: 'Contact Us' }]" heading="Contact Us" [text]="intro" />

    <section class="ct">
      <div class="ct__card" appReveal>
        <div class="ct__who">
          <img
            src="assets/img/contact.jpg"
            alt="Violette Hanna holding a camera up to her eye"
            width="200"
            height="200"
            loading="lazy"
            decoding="async" />
          <strong>{{ site.name }}</strong>
          <span>I reply within 24 hours</span>
        </div>
        <app-booking-form />
      </div>

      <ul class="ct__info" appReveal="120">
        <li>
          <span><app-icon name="mail" [size]="22" /> Email</span>
          <a [href]="'mailto:' + site.email">{{ site.email }}</a>
        </li>
        <li>
          <span><app-icon name="phone" [size]="22" /> Phone</span>
          <a [href]="'tel:' + site.phone">{{ site.phone }}</a>
        </li>
        <li>
          <span><app-icon name="pin" [size]="22" /> Location</span>
          {{ site.location }}
        </li>
        <li>
          <span><app-icon name="clock" [size]="22" /> Time</span>
          <em><i>{{ site.days }}</i><i>{{ site.hours }}</i></em>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .ct {
        padding: 72px var(--pad) 90px;
      }
      .ct__card {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        gap: 50px;
        align-items: center;
        max-width: 960px;
        margin-inline: auto;
        padding: 50px;
        background: var(--bg-light);
        border: 1px solid var(--line);
        border-radius: 14px;
      }
      .ct__who {
        display: grid;
        justify-items: center;
        gap: 6px;
        text-align: center;
      }
      .ct__who img {
        width: 200px;
        height: 200px;
        margin-bottom: 14px;
        border: 6px solid var(--past);
        border-radius: 50%;
        object-fit: cover;
      }
      .ct__who strong {
        font-family: var(--head);
        font-style: italic;
        font-weight: 400;
        font-size: 26px;
        color: var(--ink);
      }
      .ct__who span {
        font-size: 14px;
        color: var(--muted);
      }
      .ct__info {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
        max-width: 960px;
        margin: 28px auto 0;
        padding: 20px;
        border-radius: 14px;
        background: var(--brown);
        color: var(--on-brown);
        --icon-cut: var(--brown);
        list-style: none;
      }
      .ct__info li {
        min-height: 96px;
        padding: 10px;
        border: 1px solid rgb(255 255 255 / 0.4);
        border-radius: 6px;
        overflow-wrap: anywhere;
      }
      .ct__info span {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .ct__info a:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      .ct__info em {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 4px 12px;
        font-style: normal;
      }
      .ct__info i {
        font-style: normal;
      }
      @media (max-width: 900px) {
        .ct__card {
          grid-template-columns: minmax(0, 1fr);
          gap: 30px;
          padding: 32px 22px;
        }
        .ct__info {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 560px) {
        .ct__info {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `
  ]
})
export class Contact {
  readonly site = SITE;
  readonly intro = INTRO;

  constructor() {
    inject(SeoService).update({
      title: `Contact — ${SITE.name}`,
      description: INTRO,
      path: '/contact-us',
      image: 'assets/img/contact.jpg'
    });
  }
}
