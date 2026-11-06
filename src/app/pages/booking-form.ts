import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SITE } from '../data/site.data';
import { Icon } from '../shared/icon';

type Status = 'idle' | 'sending' | 'sent' | 'draft' | 'failed';

@Component({
  selector: 'app-booking-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon],
  template: `
        <form class="ct__form" (ngSubmit)="advance()" novalidate>
          @if (step() < 3) {
            <ol class="ct__prog" aria-label="Progress">
              @for (n of [0, 1, 2]; track n) {
                <li [class.is-on]="n <= step()" [attr.aria-current]="n === step() ? 'step' : null"></li>
              }
            </ol>
          }

          @switch (step()) {
            @case (0) {
              <div class="ct__step">
                <p class="eyebrow">Step 1 of 3</p>
                <h3>What Are We Capturing?</h3>
                <div class="ct__cards" role="radiogroup" aria-label="Type of shoot">
                  @for (option of interests; track option.label) {
                    <button
                      type="button"
                      role="radio"
                      class="ct__card"
                      [class.is-on]="interest() === option.label"
                      [attr.aria-checked]="interest() === option.label"
                      [style.background-image]="'url(' + option.image + ')'"
                      (click)="interest.set(option.label)">
                      <span>{{ option.label }}</span>
                    </button>
                  }
                </div>
              </div>
            }
            @case (1) {
              <div class="ct__step">
                <p class="eyebrow">Step 2 of 3</p>
                <h3>When Are You Thinking?</h3>
                <div class="ct__times" role="radiogroup" aria-label="Timing">
                  @for (option of timings; track option) {
                    <button
                      type="button"
                      role="radio"
                      class="ct__time"
                      [class.is-on]="timing() === option"
                      [attr.aria-checked]="timing() === option"
                      (click)="timing.set(option)">
                      {{ option }}
                    </button>
                  }
                </div>
              </div>
            }
            @case (2) {
              <div class="ct__step">
                <p class="eyebrow">Step 3 of 3</p>
                <h3>Tell Me About You</h3>
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
                    <span class="sr-only">Phone number (optional)</span>
                    <input name="phone" type="tel" placeholder="Phone number (optional)" autocomplete="tel" [(ngModel)]="phone" />
                  </label>
                </div>
                <label class="ct__message">
                  <span class="sr-only">Your message</span>
                  <textarea name="message" rows="2" placeholder="Anything you’d like me to know" [(ngModel)]="message" [attr.aria-invalid]="errors().message"></textarea>
                  @if (errors().message) {
                    <small role="alert">Please write a short message.</small>
                  }
                </label>
              </div>
            }
            @default {
              <div class="ct__step ct__done" role="status">
                <span class="ct__check" aria-hidden="true"><app-icon name="leaf" /></span>
                <h3>{{ status() === 'sent' ? 'Request Received' : 'Almost There' }}</h3>
                <p>
                  @if (status() === 'sent') {
                    Thank you. I will reply within 24 hours with the next steps.
                  } @else {
                    Your email app is opening with your request filled in. Press send there to finish.
                  }
                </p>
                <button type="button" class="ct__back" (click)="reset()">Send another request</button>
              </div>
            }
          }

          @if (step() < 3) {
            <div class="ct__nav">
              @if (step() > 0) {
                <button type="button" class="ct__back" (click)="back()">← Back</button>
              } @else {
                <span></span>
              }
              <button type="submit" class="plank" [disabled]="status() === 'sending'">
                {{ step() < 2 ? 'Next' : status() === 'sending' ? 'Sending…' : 'Send Request' }}
                <app-icon name="leaf" />
              </button>
            </div>
            <p class="ct__status" aria-live="polite">
              @if (status() === 'failed') {
                Something went wrong. Please email {{ site.email }} directly.
              }
            </p>
          }
        </form>
  `,
  styles: [
    `
      :host {
        display: flex;
      }
      .ct__form {
        flex: 1;
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
      .ct__prog {
        display: flex;
        gap: 8px;
        width: 100%;
        margin-bottom: 26px;
        list-style: none;
      }
      .ct__prog li {
        flex: 1;
        height: 3px;
        border-radius: 2px;
        background: var(--line);
        transition: background-color 0.5s ease;
      }
      .ct__prog li.is-on {
        background: var(--brown);
      }
      .ct__step {
        width: 100%;
        animation: ct-in 0.5s var(--ease) both;
      }
      @keyframes ct-in {
        from {
          opacity: 0;
          transform: translateX(18px);
        }
      }
      .ct__cards {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 24px;
      }
      .ct__card {
        position: relative;
        aspect-ratio: 3 / 4;
        padding: 0;
        border: 2px solid transparent;
        background-size: cover;
        background-position: center;
        cursor: pointer;
        overflow: hidden;
        transition:
          transform 0.35s var(--ease),
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }
      .ct__card::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(transparent 45%, rgb(79 47 40 / 0.82));
      }
      .ct__card span {
        position: absolute;
        z-index: 1;
        left: 10px;
        right: 10px;
        bottom: 10px;
        color: #fff;
        font-family: var(--head);
        font-style: italic;
        font-size: 17px;
        line-height: 1.15;
        text-align: left;
      }
      .ct__card:hover {
        transform: translateY(-4px);
      }
      .ct__card.is-on {
        border-color: var(--brown);
        box-shadow: 0 0 0 3px var(--tan);
      }
      .ct__times {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 24px;
      }
      .ct__time {
        padding: 18px 12px;
        border: 1px solid var(--line);
        background: none;
        color: var(--ink);
        cursor: pointer;
        transition:
          background-color 0.25s ease,
          color 0.25s ease,
          border-color 0.25s ease;
      }
      .ct__time:hover {
        border-color: var(--brown);
      }
      .ct__time.is-on {
        background: var(--brown);
        border-color: var(--brown);
        color: var(--on-brown);
      }
      .ct__nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: 26px;
      }
      .ct__back {
        padding: 0;
        border: 0;
        background: none;
        color: var(--muted);
        cursor: pointer;
        transition: color 0.3s ease;
      }
      .ct__back:hover {
        color: var(--brown);
      }
      .ct__done {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-block: 50px;
        text-align: center;
      }
      .ct__done p {
        margin-block: 8px 20px;
        color: var(--muted);
      }
      .ct__check {
        display: grid;
        place-items: center;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background: var(--brown);
        color: var(--on-brown);
      }
      .ct__message {
        display: block;
        width: 100%;
        margin-block: 20px 0;
      }
      .ct__status {
        min-height: 24px;
        margin-top: 12px;
        color: var(--brown);
      }
      @media (max-width: 900px) {
        .ct__form {
          border-inline-start: 1px solid var(--line);
          padding: 24px 20px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .ct__step {
          animation: none;
        }
      }
      @media (max-width: 560px) {
        .ct__fields {
          grid-template-columns: minmax(0, 1fr);
        }
        .ct__cards {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `
  ]
})
/** The three-step booking request: what, when, then who. Sends by EmailJS, or opens the visitor's mail app until it is set up. */
export class BookingForm {
  readonly site = SITE;
  readonly interests = [
    { label: 'Portraits', image: 'assets/img/p-woman-profile.jpg' },
    { label: 'Weddings & Events', image: 'assets/img/w-bride-field.jpg' },
    { label: 'Products & Commercial', image: 'assets/img/c-still.jpg' },
    { label: 'Nature & Landscape', image: 'assets/img/n-lake-pines.jpg' }
  ];
  readonly timings = ['As soon as possible', 'In 1 to 3 months', 'In 3 to 6 months', 'Just exploring'];

  readonly name = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly subject = signal('');
  readonly message = signal('');
  readonly interest = signal(this.interests[0].label);
  readonly timing = signal(this.timings[3]);
  /** 0 and 1 are the choices, 2 the details, 3 the thank-you. */
  readonly step = signal(0);
  readonly status = signal<Status>('idle');
  readonly errors = signal({ name: false, email: false, message: false });

  advance(): void {
    if (this.step() < 2) this.step.update((n) => n + 1);
    else void this.submit();
  }

  back(): void {
    this.step.update((n) => Math.max(0, n - 1));
  }

  reset(): void {
    this.status.set('idle');
    this.step.set(0);
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
        `Timing: ${this.timing()}`,
        '',
        this.message()
      ].join('\n');
      const subject = this.subject() || `${this.interest()} enquiry from ${this.name()}`;
      this.status.set('draft');
      this.step.set(3);
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
            timing: this.timing(),
            message: this.message()
          }
        })
      });
      if (!response.ok) throw new Error(`EmailJS ${response.status}`);
      this.status.set('sent');
      this.step.set(3);
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
