import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../shared/icon';
import { Leaves } from '../shared/leaves';
import { Reveal } from '../shared/reveal.directive';

/** A photograph dissolving into the page on the left, her reasons on the right, leaves in the corner. */
@Component({
  selector: 'app-story',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Leaves, Reveal, RouterLink],
  template: `
    <section class="sy" #section>
      <figure class="sy__photo">
        <img src="assets/img/w-bride-field.jpg" alt="A bride holding her bouquet among the trees" loading="lazy" decoding="async" />
      </figure>
      <div class="sy__copy">
        <app-leaves class="sy__leaves" />
        <p class="eyebrow" appReveal>The Story</p>
        <h2 class="heading" appReveal="80">Photographing With Heart</h2>
        <i class="sy__rule" appReveal="120" aria-hidden="true"></i>
        <p class="sy__lead" appReveal="160">Every person and every place has something worth keeping.</p>
        <p appReveal="220">
          My work is about the connection between a person and a picture. Whether it is a portrait, a wedding day, a
          brand’s new product or a quiet landscape, I want the photograph to feel like the moment did.
        </p>
        <p appReveal="280">
          Through patient observation and honest direction I look for light that flatters and moments nobody planned.
          From studios and ballrooms to open hills, each frame is a small reminder of what is worth remembering.
        </p>
        <a class="plank" routerLink="/contact-us" appReveal="340">Contact Us <app-icon name="leaf" /></a>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--bg-light);
      }
      .sy {
        position: relative;
        min-height: 709px;
        overflow: hidden;
      }
      .sy__photo {
        position: absolute;
        inset: 0 50% 0 0;
        margin: 0;
      }
      .sy__photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 22% 25%;
        -webkit-mask: linear-gradient(to right, #000 74%, transparent) left / 68% 100% no-repeat;
        mask: linear-gradient(to right, #000 74%, transparent) left / 68% 100% no-repeat;
        transition:
          -webkit-mask-size 1.5s var(--ease),
          mask-size 1.5s var(--ease);
      }
      .sy.is-open .sy__photo img {
        -webkit-mask-size: 140% 100%;
        mask-size: 140% 100%;
      }
      .sy__copy {
        position: relative;
        margin-left: 52.08vw;
        margin-right: 56px;
        padding-top: 79px;
        padding-bottom: 80px;
        color: var(--muted);
      }
      .sy__leaves {
        position: absolute;
        top: 0;
        right: -56px;
        width: 180px;
      }
      .heading {
        margin-top: 20px;
      }
      .sy__rule {
        display: block;
        width: 24px;
        height: 1px;
        margin: 69px 0 0 -30px;
        background: var(--line);
      }
      .sy__lead {
        margin-top: 72px;
      }
      p + p {
        margin-top: 24px;
      }
      .sy__copy p:not(.eyebrow) {
        text-align: justify;
        opacity: 0.8;
      }
      .plank {
        margin-top: 44px;
      }
      @media (max-width: 860px) {
        .sy__photo {
          position: relative;
          inset: auto;
          height: 100vw;
          max-height: 66svh;
        }
        .sy__photo img,
        .sy.is-open .sy__photo img {
          -webkit-mask: linear-gradient(to top, transparent, #000 22%);
          mask: linear-gradient(to top, transparent, #000 22%);
        }
        .sy__copy {
          margin: 0;
          padding: 40px var(--pad) 64px;
        }
        .sy__leaves {
          right: 0;
          width: 120px;
        }
        .sy__rule {
          margin: 24px 0 0;
        }
        .sy__lead {
          margin-top: 24px;
        }
      }
    `
  ]
})
export class Story {
  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.section().nativeElement;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-open');
            observer.disconnect();
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
