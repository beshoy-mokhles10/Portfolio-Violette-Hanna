import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../core/seo.service';
import { SITE } from '../data/site.data';
import { Reveal } from '../shared/reveal.directive';

interface LegalDoc {
  path: string;
  kicker: string;
  heading: string;
  intro: string;
  title: string;
  lead: string;
  sections: { heading: string; text: string }[];
}

/** TODO(violette): starting drafts, not legal advice. Have them reviewed for her country before publishing. */
const DOCS: Record<string, LegalDoc> = {
  privacy: {
    path: '/privacy-policy',
    kicker: `${SITE.name} • Your Privacy Matters`,
    heading: 'Your Privacy, My Promise',
    intro: 'This policy explains what information is collected when you visit this website or get in touch, and how it is used.',
    title: 'Privacy Policy',
    lead: 'Every interaction should be handled with care, transparency and respect.',
    sections: [
      { heading: 'Information I Collect', text: 'When you send a message through the contact form, I receive the name, email address, phone number and message you choose to provide. The website does not ask for anything else.' },
      { heading: 'How It Is Used', text: 'Your details are used only to reply to you and to arrange and deliver the work you ask about. They are not sold or shared for marketing.' },
      { heading: 'Third-Party Services', text: 'The site loads fonts from Google Fonts and Fontshare, and is served by a hosting provider. These services may process technical data such as your IP address, under their own policies.' },
      { heading: 'Visit Statistics', text: 'The site counts visits in an anonymous way, such as which pages are opened and from which country. It sets no cookies and does not identify you personally.' },
      { heading: 'Your Choices', text: 'You can ask to see, correct or delete the information you have sent me at any time by writing to the email address on the contact page.' },
      { heading: 'Changes', text: 'This policy may be updated from time to time. The current version is always on this page.' }
    ]
  },
  terms: {
    path: '/terms-and-conditions',
    kicker: `${SITE.name} • Terms Of Use`,
    heading: 'The Terms, Plainly',
    intro: 'These terms apply to your use of this website and to the photographs shown on it.',
    title: 'Terms & Conditions',
    lead: 'By using this website you agree to the terms below.',
    sections: [
      { heading: 'Use Of Images', text: 'Unless stated otherwise, the photographs on this site are protected by copyright and may not be copied, downloaded or reused without written permission.' },
      { heading: 'Bookings', text: 'Details of each shoot, including dates, deliverables and fees, are agreed in writing before work begins, and that agreement takes priority over this page.' },
      { heading: 'Client Galleries', text: 'The usage rights for delivered photographs are set out in the agreement for each shoot. Commercial use must be agreed in advance.' },
      { heading: 'Accuracy', text: 'I try to keep the information on this site correct and up to date, but it is provided as is and may change without notice.' },
      { heading: 'Contact', text: 'Questions about these terms can be sent to the email address on the contact page.' }
    ]
  }
};

@Component({
  selector: 'app-legal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="lg">
      <header class="lg__hero">
        <p class="eyebrow" appReveal>{{ doc.kicker }}</p>
        <h1 appReveal="80">{{ doc.heading }}</h1>
        <p class="lg__intro" appReveal="160">{{ doc.intro }}</p>
      </header>
      <div class="lg__body">
        <h2>{{ doc.title }}</h2>
        <p class="lg__lead">{{ doc.lead }}</p>
        <ol>
          @for (section of doc.sections; track section.heading; let i = $index) {
            <li>
              <h3>{{ i + 1 }}. {{ section.heading }}</h3>
              <p>{{ section.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: [
    `
      .lg {
        padding: 140px var(--pad) 90px;
      }
      .lg__hero {
        display: grid;
        justify-items: center;
        gap: 18px;
        max-width: 860px;
        margin-inline: auto;
        text-align: center;
      }
      h1 {
        font-size: clamp(44px, 5.2vw, 76px);
      }
      .lg__intro,
      .lg__lead,
      li p {
        color: var(--muted);
      }
      .lg__body {
        max-width: 860px;
        margin: 60px auto 0;
        padding: clamp(24px, 3.4vw, 48px);
        background: var(--bg-light);
      }
      h2 {
        font-size: 40px;
      }
      .lg__lead {
        margin-top: 12px;
      }
      li {
        margin-top: 30px;
      }
      h3 {
        margin-bottom: 10px;
        font-size: 25px;
      }
    `
  ]
})
export class Legal {
  readonly doc = DOCS[inject(ActivatedRoute).snapshot.data['doc'] as string];

  constructor() {
    inject(SeoService).update({
      title: `${this.doc.title} — ${SITE.name}`,
      description: this.doc.intro,
      path: this.doc.path
    });
  }
}
