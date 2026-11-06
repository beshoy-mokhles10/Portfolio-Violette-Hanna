import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavService } from '../core/nav.service';
import { QUICK_LINKS, SITE } from '../data/site.data';
import { Icon } from '../shared/icon';

/** Name, links and details, with a landscape rising out of the bottom of the page. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RouterLink],
  template: `
    <footer class="ft">
      <div class="ft__bg" aria-hidden="true"></div>

      <a href="/" class="ft__sig" (click)="$event.preventDefault(); nav.home()" aria-label="Violette Hanna, back to top">{{ site.name }}</a>
      <span class="ft__rule" aria-hidden="true"></span>
      <p class="ft__tag">{{ site.tagline[0] }}</p>

      <nav class="ft__links" aria-label="Quick links">
        @for (link of links; track link.to) {
          <button type="button" (click)="nav.go(link.to)">{{ link.label }}</button>
        }
      </nav>

      <p class="ft__contact">
        <a [href]="'mailto:' + site.email">{{ site.email }}</a>
        <span aria-hidden="true">·</span>
        <span>{{ site.phone }}</span>
      </p>

      <ul class="ft__socials">
        @for (social of site.socials; track social.label) {
          <li>
            <a [href]="social.href" target="_blank" rel="noopener noreferrer" [attr.aria-label]="social.label">
              <app-icon [name]="social.icon" [size]="14" />
            </a>
          </li>
        }
      </ul>

      <div class="ft__bottom">
        <p>© {{ year }} {{ site.name }} Photography. All rights reserved.</p>
        <p class="ft__credit">Designed &amp; developed by
          <a [href]="designer" target="_blank" rel="noopener noreferrer" aria-label="Beshoy Mokhles on Instagram (opens in a new tab)"><strong>Beshoy Mokhles</strong></a></p>
        <p class="ft__legal">
          <a routerLink="/privacy-policy">Privacy Policy</a>
          <a routerLink="/terms-and-conditions">Terms &amp; Conditions</a>
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      .ft {
        position: relative;
        overflow: hidden;
        padding: clamp(80px, 9vw, 130px) clamp(24px, 8.33vw, 120px) 28px;
        background: linear-gradient(to bottom, var(--bg) 0%, var(--bg-deep) 100%);
        color: var(--ink);
        text-align: center;
      }
      .ft__bg {
        position: absolute;
        inset: 0;
        background: url('/assets/img/n-forest.jpg') center / cover no-repeat;
        filter: var(--lens);
        mix-blend-mode: multiply;
        opacity: 0.1;
        -webkit-mask-image: linear-gradient(to bottom, transparent, #000 55%);
        mask-image: linear-gradient(to bottom, transparent, #000 55%);
        animation: ft-breathe 18s ease-in-out infinite alternate;
      }
      @keyframes ft-breathe {
        to {
          opacity: 0.4;
        }
      }
      .ft > :not(.ft__bg) {
        position: relative;
      }
      .ft__sig {
        display: inline-block;
        font-family: 'Allura', cursive;
        font-size: clamp(64px, 11vw, 150px);
        line-height: 1.05;
        color: var(--brown);
        animation: ft-rise 2.4s ease both;
      }
      @keyframes ft-rise {
        from {
          opacity: 0;
          transform: translateY(14px);
          letter-spacing: 0.06em;
        }
      }
      .ft__rule {
        display: block;
        width: 120px;
        height: 1px;
        margin: 18px auto;
        background: var(--brown);
        opacity: 0.5;
      }
      .ft__tag {
        font-family: 'Fraunces', serif;
        font-style: italic;
        font-size: clamp(16px, 1.5vw, 20px);
        color: var(--muted);
      }
      .ft__links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 14px 34px;
        margin: 44px 0 22px;
      }
      .ft__links button {
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        font: inherit;
        font-size: 13px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        cursor: pointer;
        transition: color 0.4s ease;
      }
      .ft__links button:hover,
      .ft__contact a:hover,
      .ft__legal a:hover {
        color: var(--brown);
      }
      .ft__contact {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px 14px;
        opacity: 0.85;
      }
      .ft__socials {
        display: flex;
        justify-content: center;
        gap: 14px;
        margin: 22px 0 54px;
      }
      .ft__socials a {
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
        border-radius: 5px;
        background: var(--brown);
        color: var(--on-brown);
        transition: background 0.3s ease;
      }
      .ft__socials a:hover {
        background: var(--brown-dark);
      }
      /* Three columns, so the credit sits exactly in the middle of the row. */
      .ft__bottom {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 10px 28px;
        padding-top: 18px;
        border-top: 1px solid var(--line);
        font-size: 13.5px;
        text-align: left;
      }
      .ft__bottom p {
        opacity: 0.85;
      }
      .ft__legal {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
      }
      .ft__bottom .ft__credit {
        text-align: center;
        font-size: 14px;
        opacity: 1;
        color: var(--ink);
      }
      .ft__credit strong {
        font-weight: 600;
        color: var(--brown);
      }
      .ft__credit a {
        text-decoration: underline;
        text-decoration-color: transparent;
        text-underline-offset: 4px;
        transition: text-decoration-color 0.3s ease;
      }
      .ft__credit a:hover,
      .ft__credit a:focus-visible {
        text-decoration-color: var(--brown);
      }
      @media (max-width: 760px) {
        .ft__bottom {
          grid-template-columns: 1fr;
          justify-items: center;
          text-align: center;
        }
        .ft__legal {
          justify-content: center;
        }
      }
      .ft__legal a {
        transition: color 0.3s ease;
      }
      @media (prefers-reduced-motion: reduce) {
        .ft__bg,
        .ft__sig {
          animation: none;
        }
        .ft__bg {
          opacity: 0.2;
        }
      }
    `
  ]
})
export class Footer {
  readonly nav = inject(NavService);
  readonly site = SITE;
  readonly links = QUICK_LINKS;
  /** The designer's Instagram, so a visitor can message him. */
  readonly designer = 'https://www.instagram.com/beshoymokhles_';
  readonly year = new Date().getFullYear();
}
