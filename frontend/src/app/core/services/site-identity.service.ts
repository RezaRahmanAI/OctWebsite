import { Injectable, computed, signal } from '@angular/core';
import { HeroVideoConfig, SiteContactChannels } from '../models';

@Injectable({ providedIn: 'root' })
export class SiteIdentityService {
  private readonly contactChannelsSignal = signal<SiteContactChannels>({
    socialLinks: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/company/objectcanvas' },
      { label: 'Facebook', url: 'https://www.facebook.com/objectcanvas' },
      { label: 'Twitter', url: 'https://twitter.com/objectcanvas' },
      { label: 'Instagram', url: 'https://www.instagram.com/objectcanvas' },
      { label: 'YouTube', url: 'https://www.youtube.com/@' },
      { label: 'GitHub', url: 'https://github.com/objectcanvas' },
    ],
    phoneNumbers: {
      local: '+880 1315-220077',
      international: '+1 415-915-0198',
    },
    whatsapp: {
      local: {
        label: 'WhatsApp (Bangladesh)',
        number: '+880 1315-220077',
        url: 'https://wa.me/8801315220077',
      },
      international: {
        label: 'WhatsApp (International)',
        number: '+1 415-915-0198',
        url: 'https://wa.me/14159150198',
      },
    },
    businessEmail: 'partnerships@objectcanvas.com',
    supportEmail: 'support@objectcanvas.com',
  });

  private readonly heroVideosSignal = signal<Record<string, HeroVideoConfig>>({
    home: {
      page: 'home',
      src: '/video/bg.mp4',
      poster:
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
      caption: 'Hero background video used across the site.',
    },
    services: {
      page: 'services',
      src: '/video/bg.mp4',
      poster:
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
      caption: 'Services hero background media.',
    },
    product: {
      page: 'product',
      src: '/video/bg.mp4',
      poster:
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
      caption: 'Product overview hero media.',
    },
    academy: {
      page: 'academy',
      src: '/video/bg.mp4',
      poster:
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
      caption: 'Academy hero background video.',
    },
    blog: {
      page: 'blog',
      src: '/video/bg.mp4',
      poster:
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
      caption: 'Insights and blog hero media.',
    },
    contact: {
      page: 'contact',
      src: '/video/bg.mp4',
      poster:
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
      caption: 'Contact page hero background.',
    },
  });

  readonly contactChannels = computed(() => this.contactChannelsSignal());
  readonly heroVideos = computed(() => this.heroVideosSignal());

  updateContactChannels(update: Partial<SiteContactChannels>): SiteContactChannels {
    const current = this.contactChannelsSignal();
    const next: SiteContactChannels = {
      socialLinks: update.socialLinks ?? current.socialLinks,
      phoneNumbers: {
        local: update.phoneNumbers?.local ?? current.phoneNumbers.local,
        international: update.phoneNumbers?.international ?? current.phoneNumbers.international,
      },
      whatsapp: {
        local: update.whatsapp?.local ?? current.whatsapp.local,
        international: update.whatsapp?.international ?? current.whatsapp.international,
      },
      businessEmail: update.businessEmail ?? current.businessEmail,
      supportEmail: update.supportEmail ?? current.supportEmail,
    };

    this.contactChannelsSignal.set(next);
    return next;
  }

  getHeroVideo(page: string): HeroVideoConfig | undefined {
    const registry = this.heroVideosSignal();
    return registry[page];
  }

  upsertHeroVideo(page: string, payload: Partial<HeroVideoConfig>): HeroVideoConfig {
    const registry = this.heroVideosSignal();
    const existing = registry[page] ?? { page, src: '', poster: '' };
    const updated: HeroVideoConfig = {
      ...existing,
      ...payload,
      page,
    };

    this.heroVideosSignal.set({ ...registry, [page]: updated });
    return updated;
  }
}
