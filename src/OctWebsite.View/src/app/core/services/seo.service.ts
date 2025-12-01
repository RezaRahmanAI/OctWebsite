import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor(private readonly title: Title, private readonly meta: Meta) {}

  update(config: SeoConfig): void {
    if (config.title) {
      this.title.setTitle(config.title);
    }

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.canonical) {
      this.setCanonicalUrl(config.canonical);
    }
  }

  private setCanonicalUrl(url: string): void {
    if (!this.isBrowser) {
      return;
    }

    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
