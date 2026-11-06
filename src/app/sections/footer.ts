import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavService } from '../core/nav.service';
import { QUICK_LINKS, SITE } from '../data/site.data';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

/** Name, links and details, with a landscape rising out of the bottom of the page. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Logo, RouterLink],
  template: `
    <footer class="ft">
      <div class="ft__top">
        <div class="ft__brand">
          <a href="/" class="ft__logo" (click)="$event.preventDefault(); nav.home()"><app-logo /></a>
          <p>{{ site.tagline[0] }}<br />{{ site.tagline[1] }}</p>
        </div>
        <div class="ft__cols">
          <nav aria-label="Quick links">
            <h2>Quick Links</h2>
            <ul>
              @for (link of links; track link.to) {
                <li><button type="button" (click)="nav.go(link.to)">{{ link.label }}</button></li>
              }
            </ul>
          </nav>
          <div>
            <h2>Contact Us</h2>
            <ul>
              <li><a [href]="'mailto:' + site.email">{{ site.email }}</a></li>
              <li>{{ site.phone }}</li>
            </ul>
            <ul class="ft__socials">
              @for (social of site.socials; track social.label) {
                <li>
                  <a [href]="social.href" target="_blank" rel="noopener noreferrer" [attr.aria-label]="social.label">
                    <app-icon [name]="social.icon" [size]="14" />
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>

      <div class="ft__bottom">
        <p>© {{ year }} {{ site.name }} Photography. All rights reserved.</p>
        <p class="ft__credit">Designed by Beshoy Mokhles</p>
        <p class="ft__legal">
          <a routerLink="/privacy-policy">Privacy Policy</a>
          <a routerLink="/terms-and-conditions">Terms &amp; Conditions</a>
        </p>
      </div>

      <div class="ft__land" aria-hidden="true"></div>
    </footer>
  `,
  styles: [
    `
      .ft {
        position: relative;
        background: var(--bg-light);
        padding: 80px clamp(24px, 8.33vw, 120px) 0;
        color: var(--muted);
        overflow: hidden;
      }
      .ft__top {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 36px 60px;
      }
      .ft__logo {
        display: inline-block;
        margin-bottom: 18px;
        color: var(--brown);
      }
      h2 {
        margin-bottom: 14px;
        font-size: 20px;
        line-height: 24px;
        color: var(--ink);
      }
      .ft__cols {
        display: flex;
        flex-wrap: wrap;
        gap: 36px 70px;
      }
      li {
        margin-bottom: 7px;
        opacity: 0.8;
      }
      .ft__brand p,
      .ft__bottom p {
        opacity: 0.8;
      }
      li button {
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        cursor: pointer;
      }
      li button,
      li a {
        display: inline-block;
        transition:
          color 0.3s ease,
          transform 0.35s var(--ease);
      }
      li button:hover,
      li a:hover {
        color: var(--brown);
        transform: translateX(4px);
      }
      .ft__legal a {
        transition: color 0.3s ease;
      }
      .ft__legal a:hover {
        color: var(--brown);
      }
      .ft__socials {
        display: flex;
        gap: 14px;
        margin-top: 14px;
      }
      .ft__socials a {
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
        border-radius: 5px;
        background: var(--brown);
        color: var(--on-brown);
      }
      .ft__socials a:hover {
        background: var(--brown-dark);
        color: var(--on-brown);
        transform: none;
      }
      .ft__bottom {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 10px 28px;
        position: relative;
        z-index: 1;
        margin-top: 44px;
        padding-top: 12px;
        border-top: 1px solid var(--line);
      }
      .ft__legal {
        display: flex;
        gap: 20px;
      }
      .ft__land {
        height: clamp(170px, 20.83vw, 300px);
        margin: -12px calc(-1 * clamp(24px, 8.33vw, 120px)) 0;
        background: url('/assets/img/n-snow.jpg') center 72% / cover no-repeat;
        -webkit-mask-image: linear-gradient(to top, #000 62%, transparent);
        mask-image: linear-gradient(to top, #000 62%, transparent);
      }
    `
  ]
})
export class Footer {
  readonly nav = inject(NavService);
  readonly site = SITE;
  readonly links = QUICK_LINKS;
  readonly year = new Date().getFullYear();
}
