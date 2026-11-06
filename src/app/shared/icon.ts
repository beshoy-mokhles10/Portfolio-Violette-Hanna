import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const PATHS: Record<string, string> = {
  info: '<circle cx="12" cy="12" r="9.500" fill="none" stroke="currentColor" stroke-width="1.700"/><path d="M12 11v6M12 7.200v1" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round"/>',
  book: '<path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 7.500h6M9 12h6M9 16.500h4" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linecap="round"/>',
  aperture: '<circle cx="12" cy="12" r="9.500" fill="none" stroke="currentColor" stroke-width="1.700"/><path d="M12 2.500L16.500 12M21 9l-9.500 1M17.500 19.800L12 12M6.500 19.800l5-8.300M3 9.500l9.500 3M8 3.500l4 9" fill="none" stroke="currentColor" stroke-width="1.400"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.700"/><circle cx="8.500" cy="10" r="1.600" fill="currentColor"/><path d="M4 17l5-4.500 3.500 3L16 12l4.500 4.500" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linejoin="round"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.700"/><path d="M3 10h18M7 14.500h10" fill="none" stroke="currentColor" stroke-width="1.700"/>',
  chat: '<path d="M3 5h12v8H8l-3 3v-3H3zM18 9h3v8h-2v3l-3-3h-5v-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  menu: '<path d="M3 6h18M3 12h14M3 18h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  close: '<path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  leaf: '<path d="M21 3C10 3 4 8 4 15c0 2 .6 3.600 1.500 5C8 12 13 9 17 8c-5 3-8.500 7-10 13 1 .4 2 .6 3 .6C17 21.600 21 14 21 3z" fill="currentColor"/>',
  arrow: '<path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor"/><path d="M3 7l9 6 9-6" fill="none" stroke="var(--icon-cut, #744225)" stroke-width="1.800"/>',
  phone: '<path d="M6 3l4 1 1 5-2.500 1.500a12 12 0 0 0 5.500 5.500L15.500 13l5 1 1 4c0 2-1.500 3-3.500 3C10 21 3 14 3 6c0-2 1-3 3-3z" fill="currentColor"/>',
  pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.500a2.500 2.500 0 1 1 0-5 2.500 2.500 0 0 1 0 5z" fill="currentColor"/>',
  clock: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.400 3.500 2-1 1.700L11 13.500V6h2z" fill="currentColor"/>',
  check: '<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.500 12.500l3 3 6-6.500" fill="none" stroke="#fff" stroke-width="2"/>',
  facebook: '<path d="M14 8.500V6.800c0-.8.500-1 1-1h2V2h-3c-3 0-4.500 2-4.500 4.500v2H7V12h2.500v10H14V12h2.800l.5-3.500z" fill="currentColor"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.200" cy="6.800" r="1.200" fill="currentColor"/>',
  linkedin: '<path d="M4 9h3.500v11H4zM5.700 3.500a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.300v1.600c.6-1 1.800-1.900 3.500-1.900 3.200 0 4.200 2 4.200 5.200V20h-3.500v-5.400c0-1.500-.4-2.700-1.900-2.700-1.600 0-2.100 1.200-2.100 2.700V20H10z" fill="currentColor"/>'
};

/** Inline SVG icons; the only icon set on the site. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg
    viewBox="0 0 24 24"
    [attr.width]="size()"
    [attr.height]="size()"
    aria-hidden="true"
    [innerHTML]="svg()"></svg>`,
  styles: [':host { display: inline-flex; flex: none; } svg { display: block; }']
})
export class Icon {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<string>();
  readonly size = input(18);
  readonly svg = computed(() => this.sanitizer.bypassSecurityTrustHtml(PATHS[this.name()] ?? ''));
}
