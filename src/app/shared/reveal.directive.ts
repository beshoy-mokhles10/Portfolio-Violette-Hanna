import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/** Blurs an element up into place the first time it enters the viewport (see `.rv` in styles.scss). */
@Directive({
  selector: '[appReveal]',
  host: { class: 'rv', '[style.--rv-delay]': 'appReveal() + "ms"' }
})
export class Reveal {
  readonly appReveal = input<number | string>(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px' }
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
