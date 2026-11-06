import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * The dark round "drag" badge that replaces the pointer over a draggable scene.
 * It follows the parent element's pointer moves; touch screens never see it.
 */
@Component({
  selector: 'app-drag-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 52 26" aria-hidden="true">
      <path class="chev" d="M6 8 L1.500 13 L6 18 M46 8 L50.500 13 L46 18" />
      <path
        class="hand"
        d="M20 14 V6.500 a1.800 1.800 0 0 1 3.600 0 V12 V4.500 a1.800 1.800 0 0 1 3.600 0 V12 V5.500 a1.800 1.800 0 0 1 3.600 0 V13 V8.500 a1.700 1.700 0 0 1 3.400 0 V16 c0 5-3 8-8 8 c-4 0-5.500-2-7-4.500 L15.600 14.500 c-1-1.700 1.300-3 2.500-1.500 L20 15.500" />
    </svg>
    <span>DRAG</span>
  `,
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 30;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 4px;
        width: 78px;
        height: 78px;
        margin: -39px 0 0 -39px;
        border-radius: 50%;
        background: var(--ink);
        color: var(--on-brown);
        pointer-events: none;
        opacity: 0;
        scale: 0.5;
        transition:
          opacity 0.25s ease,
          scale 0.35s var(--ease);
        will-change: transform;
      }
      :host(.is-on) {
        opacity: 1;
        scale: 1;
      }
      svg {
        width: 42px;
        height: 22px;
      }
      path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.400;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      span {
        font-size: 9px;
        letter-spacing: 0.26em;
        text-indent: 0.26em;
      }
      @media (hover: none) {
        :host {
          display: none;
        }
      }
    `
  ]
})
export class DragCursor {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const zone = el.parentElement as HTMLElement;
      const move = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        const box = zone.getBoundingClientRect();
        el.style.transform = `translate(${e.clientX - box.left}px, ${e.clientY - box.top}px)`;
        el.classList.add('is-on');
      };
      const leave = () => el.classList.remove('is-on');
      zone.addEventListener('pointermove', move);
      zone.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        zone.removeEventListener('pointermove', move);
        zone.removeEventListener('pointerleave', leave);
      });
    });
  }
}
