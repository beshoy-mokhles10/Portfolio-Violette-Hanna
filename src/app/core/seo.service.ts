import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../data/site.data';

export interface SeoData {
  title: string;
  description: string;
  /** Route path, e.g. '/blogs/before-the-shutter'. */
  path: string;
  /** Site-relative image; defaults to the hero. */
  image?: string;
}

/** Per-route title, description, canonical and share tags. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  update({ title, description, path, image = 'assets/img/hero.jpg' }: SeoData): void {
    const url = `${SITE.url}${path}`;
    const imageUrl = `${SITE.url}/${image}`;
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  }
}
