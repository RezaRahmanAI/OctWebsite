import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { HomeContactComponent } from '../home/sections/contact/home-contact.component';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { ContactOfficeModel, ContactPageApiService, ContactPageModel } from '../../core/services/contact-page-api.service';
import { ContactChannelsApiService } from '../../core/services/contact-channels-api.service';
import type { HomeContent } from '../../core/models/home-content.model';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent, SectionHeadingCta } from '../../shared/components/section-heading/section-heading.component';
import { FaqsService } from '../../core/services/faqs.service';

interface ContactPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  consultationOptions: string;
  regionalSupport: string;
  emails: string[];
  formOptions: string[];
  ndaLabel: string;
  responseTime: string;
  heroVideoUrl?: string | null;
  heroMetaLine: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  officesEyebrow: string;
  officesTitle: string;
  officesDescription: string;
  offices: ContactOfficeModel[];
  mapEmbedUrl: SafeResourceUrl;
  mapTitle: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HomeContactComponent, AssetUrlPipe, SectionHeadingComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly contactPageApi = inject(ContactPageApiService);
  private readonly contactChannelsApi = inject(ContactChannelsApiService);
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly faqsService = inject(FaqsService);

  protected readonly contactPage = computed<ContactPageContent | null>(() => {
    const apiPage = this.contactPageApi.content();
    return apiPage ? this.mapFromApi(apiPage) : null;
  });
  protected readonly heroVideoUrl = computed(() => this.contactPage()?.heroVideoUrl ?? null);
  protected readonly formOptions = computed(() => this.contactPage()?.formOptions?.filter(Boolean) ?? []);
  protected readonly heroCtas = computed<SectionHeadingCta[]>(() => {
    const page = this.contactPage();
    if (!page) return [];

    return [
      {
        label: page.primaryCtaLabel,
        routerLink: page.primaryCtaLink,
      },
      {
        label: 'View offices ↓',
        onClick: () => this.scrollToOffices(),
        variant: 'secondary',
      },
    ];
  });
  protected readonly contactData = computed<HomeContent['contact'] | null>(() => {
    const page = this.contactPageApi.content();
    if (!page) {
      return null;
    }

    const channels = this.contactChannelsApi.channels();
    const phones = [channels?.localPhoneNumber, channels?.internationalPhoneNumber].filter(Boolean) as string[];
    const emails = [
      channels?.businessEmail ?? page.emails[0],
      channels?.supportEmail ?? page.emails[1],
    ].filter(Boolean) as string[];

    return {
      header: {
        eyebrow: page.headerEyebrow,
        title: page.headerTitle,
        subtitle: page.headerSubtitle,
      },
      headquarters: page.headquarters,
      phones,
      emails: emails.map((email, index) => ({
        label: index === 0 ? 'Business' : index === 1 ? 'Support' : `Email ${index + 1}`,
        value: email,
      })),
      businessHours: [...page.businessHours],
      socials: (channels?.socialLinks ?? []).map(link => ({ label: link.label, url: link.url })),
      consultation: { label: page.primaryCtaLabel, routerLink: page.primaryCtaLink },
      profileDownload: {
        label: page.profileDownloadLabel,
        url: page.profileDownloadUrl,
      },
    } satisfies HomeContent['contact'];
  });
  protected readonly faqs = this.faqsService.faqs;

  ngOnInit(): void {
    this.contactPageApi.load();
    void this.faqsService.load();
  }

  scrollToOffices(): void {
    const el = this.document.getElementById('offices');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  private mapFromApi(model: ContactPageModel): ContactPageContent {
    return {
      header: {
        eyebrow: model.headerEyebrow,
        title: model.headerTitle,
        subtitle: model.headerSubtitle,
      },
      consultationOptions: model.consultationOptions,
      regionalSupport: model.regionalSupport,
      emails: model.emails,
      formOptions: model.formOptions,
      ndaLabel: model.ndaLabel,
      responseTime: model.responseTime,
      heroVideoUrl: model.heroVideo?.url ?? model.heroVideo?.fileName ?? null,
      heroMetaLine: model.heroMetaLine,
      primaryCtaLabel: model.primaryCtaLabel,
      primaryCtaLink: model.primaryCtaLink,
      officesEyebrow: model.officesEyebrow,
      officesTitle: model.officesTitle,
      officesDescription: model.officesDescription,
      offices: model.offices,
      mapEmbedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(model.mapEmbedUrl),
      mapTitle: model.mapTitle,
    };
  }
}
