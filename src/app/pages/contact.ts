import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../core/seo.service';
import { SITE } from '../data/site.data';
import { BookingForm } from './booking-form';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';
import { Reveal } from '../shared/reveal.directive';

const INTRO = 'Have a shoot in mind or a print to order? Write to me and every message will be answered personally.';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingForm, Icon, PageHero, Reveal],
  template: `
    <app-page-hero [crumbs]="[{ label: 'Home', link: '/' }, { label: 'Contact Us' }]" heading="Contact Us" [text]="intro" />

    <section class="ct">
      <header class="section-head">
        <p class="eyebrow" appReveal>Get In Touch</p>
        <h2 class="heading" appReveal="80">I Would Love To Hear From You</h2>
      </header>

      <div class="ct__panel" appReveal="120">
        <img src="assets/img/contact.jpg" alt="A photographer holding a camera up to her eye" loading="lazy" decoding="async" />

        <app-booking-form />

        <ul class="ct__info">
          <li>
            <span><app-icon name="mail" [size]="26" /> Email</span>
            <a [href]="'mailto:' + site.email">{{ site.email }}</a>
          </li>
          <li>
            <span><app-icon name="phone" [size]="26" /> Phone</span>
            {{ site.phone }}
          </li>
          <li>
            <span><app-icon name="pin" [size]="26" /> Location</span>
            {{ site.location }}
          </li>
          <li>
            <span><app-icon name="clock" [size]="26" /> Time</span>
            <em><i>{{ site.days }}</i><i>{{ site.hours }}</i></em>
          </li>
        </ul>
      </div>
    </section>
  `,
  styles: [
    `
      .ct {
        padding: 72px var(--pad) 80px;
      }
      .ct__panel {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        margin-top: 48px;
      }
      .ct__panel > img {
        width: 100%;
        height: 100%;
        min-height: 320px;
        object-fit: cover;
      }
      .ct__info {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
        padding: 20px;
        background: var(--brown);
        color: var(--on-brown);
        --icon-cut: var(--brown);
      }
      .ct__info li {
        padding: 10px;
        border: 1px solid rgb(247 249 234 / 0.4);
        min-height: 106px;
        overflow-wrap: anywhere;
      }
      .ct__info span {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
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
        .ct__panel {
          grid-template-columns: minmax(0, 1fr);
        }
        .ct__panel > img {
          height: 70vw;
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
