import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SITE } from '../data/site.data';
import { Icon } from '../shared/icon';

type Status = 'idle' | 'sending' | 'sent' | 'draft' | 'failed';

/**
 * The booking request: what kind of shoot, roughly when, then who. It sends by
 * EmailJS, or opens the visitor's mail app until the keys are set up.
 */
@Component({
  selector: 'app-booking-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon],
  template: `
    @if (status() === 'sent' || status() === 'draft') {
      <div class="bf__done" role="status">
        <span class="bf__check" aria-hidden="true"><app-icon name="leaf" /></span>
        <h3>Thank you</h3>
        <p>
          @if (status() === 'sent') {
            I will reply within 24 hours.
          } @else {
            Your email app is opening. Press send there to finish.
          }
        </p>
        <button type="button" class="bf__link" (click)="status.set('idle')">Send another request</button>
      </div>
    } @else {
      <form class="bf" (ngSubmit)="submit()" novalidate>
        <h3>Book A Session</h3>

        <div class="bf__two">
          <label>
            <span class="bf__label">I’d like</span>
            <select name="interest" [(ngModel)]="interest">
              @for (option of interests; track option) {
                <option [value]="option">{{ option }}</option>
              }
            </select>
          </label>
          <label>
            <span class="bf__label">Around</span>
            <select name="timing" [(ngModel)]="timing">
              @for (option of timings; track option) {
                <option [value]="option">{{ option }}</option>
              }
            </select>
          </label>
        </div>

        <div class="bf__two">
          <label>
            <span class="sr-only">Full name</span>
            <input name="name" placeholder="Name" autocomplete="name" [(ngModel)]="name" [attr.aria-invalid]="errors().name" />
            @if (errors().name) {
              <small role="alert">Please enter your name.</small>
            }
          </label>
          <label>
            <span class="sr-only">Email address</span>
            <input name="email" type="email" placeholder="Email" autocomplete="email" [(ngModel)]="email" [attr.aria-invalid]="errors().email" />
            @if (errors().email) {
              <small role="alert">Please enter a valid email.</small>
            }
          </label>
        </div>

        <label>
          <span class="sr-only">Phone number</span>
          <input name="phone" type="tel" inputmode="tel" placeholder="Phone number" autocomplete="tel" [(ngModel)]="phone" [attr.aria-invalid]="errors().phone" />
          @if (errors().phone) {
            <small role="alert">Please enter a valid phone number.</small>
          }
        </label>

        <label>
          <span class="sr-only">Your message</span>
          <textarea name="message" rows="2" placeholder="Anything else?" [(ngModel)]="message" [attr.aria-invalid]="errors().message"></textarea>
          @if (errors().message) {
            <small role="alert">Please write a short message.</small>
          }
        </label>

        <div class="bf__send">
          <button type="submit" [disabled]="status() === 'sending'">{{ status() === 'sending' ? 'Sending…' : 'Send Request' }}</button>
          <p aria-live="polite">
            @if (status() === 'failed') {
              Something went wrong. Please email {{ site.email }} directly.
            }
          </p>
        </div>
      </form>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .bf {
        display: grid;
        gap: 18px;
      }
      h3 {
        font-size: 32px;
        line-height: 1.1;
      }
      .bf__two {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }
      .bf__label {
        display: block;
        margin-bottom: 4px;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      input,
      textarea,
      select {
        display: block;
        width: 100%;
        padding: 12px 4px;
        border: 0;
        border-bottom: 1px solid var(--line);
        border-radius: 0;
        background: none;
        color: var(--ink);
        resize: none;
      }
      select {
        cursor: pointer;
      }
      input:focus,
      textarea:focus,
      select:focus {
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
      .bf__send {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px 18px;
        margin-top: 6px;
      }
      .bf__send button {
        padding: 13px 34px;
        border: 0;
        border-radius: 999px;
        background: var(--brown);
        color: var(--on-brown);
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .bf__send button:hover:not(:disabled) {
        background: var(--brown-dark);
      }
      .bf__send button:disabled {
        opacity: 0.6;
        cursor: wait;
      }
      .bf__send p {
        color: var(--brown);
      }
      .bf__done {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-block: 30px;
        text-align: center;
      }
      .bf__done p {
        margin-block: 8px 18px;
        color: var(--muted);
      }
      .bf__check {
        display: grid;
        place-items: center;
        width: 56px;
        height: 56px;
        margin-bottom: 16px;
        border-radius: 50%;
        background: var(--brown);
        color: var(--on-brown);
      }
      .bf__link {
        padding: 0;
        border: 0;
        background: none;
        color: var(--brown);
        text-decoration: underline;
        text-underline-offset: 4px;
        cursor: pointer;
      }
      @media (max-width: 560px) {
        .bf__two {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `
  ]
})
export class BookingForm {
  readonly site = SITE;
  readonly interests = ['A portrait', 'A wedding', 'Commercial work', 'Landscape prints'];
  readonly timings = ['This month', 'Next month', 'In 3 months', 'Just exploring'];

  readonly interest = signal(this.interests[0]);
  readonly timing = signal(this.timings[3]);
  readonly name = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly message = signal('');
  readonly status = signal<Status>('idle');
  readonly errors = signal({ name: false, email: false, phone: false, message: false });

  async submit(): Promise<void> {
    const digits = this.phone().replace(/\D/g, '').length;
    const errors = {
      name: this.name().trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()),
      // A phone number is asked for; when given it must look like one.
      phone: digits < 7 || digits > 15,
      message: false
    };
    this.errors.set(errors);
    if (errors.name || errors.email || errors.phone) return;

    const { serviceId, templateId, publicKey } = SITE.emailjs;
    if (!serviceId || !templateId || !publicKey) {
      // No mail service set up yet: hand over to the visitor's own mail app.
      const body = [
        `Name: ${this.name()}`,
        `Email: ${this.email()}`,
        `Phone: ${this.phone()}`,
        `Interested in: ${this.interest()}`,
        `Timing: ${this.timing()}`,
        '',
        this.message()
      ].join('\n');
      this.status.set('draft');
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`${this.interest()}: request from ${this.name()}`)}&body=${encodeURIComponent(body)}`;
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
            interest: this.interest(),
            timing: this.timing(),
            message: this.message() || '(no message)'
          }
        })
      });
      if (!response.ok) throw new Error(`EmailJS ${response.status}`);
      this.status.set('sent');
      this.name.set('');
      this.email.set('');
      this.phone.set('');
      this.message.set('');
    } catch {
      this.status.set('failed');
    }
  }
}
