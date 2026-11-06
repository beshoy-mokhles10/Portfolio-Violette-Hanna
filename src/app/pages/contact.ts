import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../core/seo.service';
import { SITE } from '../data/site.data';
import { Icon } from '../shared/icon';
import { PageHero } from '../shared/page-hero';
import { Reveal } from '../shared/reveal.directive';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const INTRO = 'Have a shoot in mind or a print to order? Write to me and every message will be answered personally.';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon, PageHero, Reveal],
  template: `
    <app-page-hero [crumbs]="[{ label: 'Home', link: '/' }, { label: 'Contact Us' }]" heading="Contact Us" [text]="intro" />

    <section class="ct">
      <header class="section-head">
        <p class="eyebrow" appReveal>Get In Touch</p>
        <h2 class="heading" appReveal="80">I Would Love To Hear From You</h2>
      </header>

      <div class="ct__panel" appReveal="120">
        <img src="assets/img/contact.jpg" alt="A photographer holding a camera up to her eye" loading="lazy" decoding="async" />

        <form class="ct__form" (ngSubmit)="submit()" novalidate>
          <p class="eyebrow">Send A Message</p>
          <h3>Let’s Start A Conversation</h3>
          <p class="ct__lead">Fill in the form and I will get back to you soon.</p>

          <div class="ct__fields">
            <label>
              <span class="sr-only">Full name</span>
              <input name="name" placeholder="Full name" autocomplete="name" [(ngModel)]="name" [attr.aria-invalid]="errors().name" />
              @if (errors().name) {
                <small role="alert">Please enter your name.</small>
              }
            </label>
            <label>
              <span class="sr-only">Email address</span>
              <input name="email" type="email" placeholder="Email address" autocomplete="email" [(ngModel)]="email" [attr.aria-invalid]="errors().email" />
              @if (errors().email) {
                <small role="alert">Please enter a valid email.</small>
              }
            </label>
            <label>
              <span class="sr-only">Phone number</span>
              <input name="phone" type="tel" placeholder="Phone number" autocomplete="tel" [(ngModel)]="phone" />
            </label>
            <label>
              <span class="sr-only">Subject</span>
              <input name="subject" placeholder="I’m writing about" [(ngModel)]="subject" />
            </label>
          </div>

          <fieldset>
            <legend>Interested in</legend>
            <div class="ct__chips">
              @for (option of interests; track option) {
                <button
                  type="button"
                  class="ct__chip"
                  [class.is-on]="interest() === option"
                  [attr.aria-pressed]="interest() === option"
                  (click)="interest.set(option)">
                  {{ option }}
                </button>
              }
            </div>
          </fieldset>

          <label class="ct__message">
            <span class="sr-only">Your message</span>
            <textarea name="message" rows="2" placeholder="Your message" [(ngModel)]="message" [attr.aria-invalid]="errors().message"></textarea>
            @if (errors().message) {
              <small role="alert">Please write a short message.</small>
            }
          </label>

          <button type="submit" class="plank" [disabled]="status() === 'sending'">
            {{ status() === 'sending' ? 'Sending…' : 'Send Message' }}
            <app-icon name="leaf" />
          </button>
          <p class="ct__status" aria-live="polite">
            @if (status() === 'sent') {
              Thank you. Your message is on its way.
            } @else if (status() === 'failed') {
              Something went wrong. Please email {{ site.email }} directly.
            }
          </p>
        </form>

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
      .ct__form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 30px;
        border: 1px solid var(--line);
        border-inline-start: 0;
      }
      h3 {
        margin-top: 18px;
        font-size: 30px;
      }
      .ct__lead {
        margin-block: 12px 18px;
        color: var(--muted);
      }
      .ct__fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
        width: 100%;
      }
      input,
      textarea {
        display: block;
        width: 100%;
        padding: 10px 8px;
        border: 0;
        border-bottom: 1px solid var(--line);
        border-radius: 0;
        background: none;
        resize: vertical;
      }
      input:focus,
      textarea:focus {
        outline: none;
        border-bottom-color: var(--brown);
      }
      ::placeholder {
        color: var(--muted);
      }
      small {
        display: block;
        margin-top: 5px;
        color: #8a2b1d;
      }
      fieldset {
        width: 100%;
        margin: 26px 0 0;
        padding: 0;
        border: 0;
      }
      legend {
        padding: 0;
        margin-bottom: 10px;
        color: var(--muted);
      }
      .ct__chips {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }
      .ct__chip {
        min-height: 46px;
        padding: 6px;
        border: 1px solid var(--line);
        background: none;
        font-size: 14px;
        line-height: 1.2;
        cursor: pointer;
        transition:
          background-color 0.25s ease,
          color 0.25s ease;
      }
      .ct__chip:hover {
        border-color: var(--brown);
      }
      .ct__chip.is-on {
        background: var(--brown);
        border-color: var(--brown);
        color: var(--on-brown);
      }
      .ct__message {
        width: 100%;
        margin-block: 18px 28px;
      }
      .ct__status {
        min-height: 24px;
        margin-top: 12px;
        color: var(--brown);
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
        .ct__form {
          border-inline-start: 1px solid var(--line);
          padding: 24px 20px;
        }
        .ct__info {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 560px) {
        .ct__fields,
        .ct__info {
          grid-template-columns: minmax(0, 1fr);
        }
        .ct__chips {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `
  ]
})
export class Contact {
  readonly site = SITE;
  readonly intro = INTRO;
  readonly interests = ['Portraits', 'Weddings & Events', 'Products & Commercial', 'Nature & Landscape'];

  readonly name = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly subject = signal('');
  readonly message = signal('');
  readonly interest = signal(this.interests[0]);
  readonly status = signal<Status>('idle');
  readonly errors = signal({ name: false, email: false, message: false });

  constructor() {
    inject(SeoService).update({
      title: `Contact — ${SITE.name}`,
      description: INTRO,
      path: '/contact-us',
      image: 'assets/img/contact.jpg'
    });
  }

  async submit(): Promise<void> {
    const errors = {
      name: this.name().trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()),
      message: this.message().trim().length < 5
    };
    this.errors.set(errors);
    if (errors.name || errors.email || errors.message) return;

    const { serviceId, templateId, publicKey } = SITE.emailjs;
    if (!serviceId || !templateId || !publicKey) {
      // No mail service set up yet: hand over to the visitor's own mail app.
      const body = [
        `Name: ${this.name()}`,
        `Email: ${this.email()}`,
        `Phone: ${this.phone()}`,
        `Interested in: ${this.interest()}`,
        '',
        this.message()
      ].join('\n');
      const subject = this.subject() || `${this.interest()} enquiry from ${this.name()}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    this.status.set('sending');
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: this.name(),
            email: this.email(),
            phone: this.phone(),
            subject: this.subject(),
            interest: this.interest(),
            message: this.message()
          }
        })
      });
      if (!response.ok) throw new Error(`EmailJS ${response.status}`);
      this.status.set('sent');
      this.name.set('');
      this.email.set('');
      this.phone.set('');
      this.subject.set('');
      this.message.set('');
    } catch {
      this.status.set('failed');
    }
  }
}
