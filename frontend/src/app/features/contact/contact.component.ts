import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';

import { ContentService } from '../../core/services/content.service';
import { HomeContactComponent } from '../home/sections/contact/home-contact.component';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { ContactPageApiService, ContactPageModel } from '../../core/services/contact-page-api.service';

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
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HomeContactComponent, AssetUrlPipe],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly content = inject(ContentService);
  private readonly contactPageApi = inject(ContactPageApiService);
  private readonly document = inject(DOCUMENT);

  protected readonly contactData = computed(() => this.content.homeContent().contact);
  private readonly fallbackContactPage = this.content.getPageSignal<ContactPageContent>('contact');
  protected readonly contactPage = computed<ContactPageContent | null>(() => {
    const apiPage = this.contactPageApi.content();
    if (apiPage) {
      return this.mapFromApi(apiPage);
    }

    return this.fallbackContactPage();
  });
  protected readonly heroVideoUrl = computed(() => this.contactPage()?.heroVideoUrl ?? '/video/contact.mp4');
  protected readonly formOptions = computed(() => {
    const options = this.contactPage()?.formOptions?.filter(Boolean) ?? [];
    return options;
  });

  ngOnInit(): void {
    this.contactPageApi.load();
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
      heroVideoUrl: model.heroVideo?.url ?? null,
    };
  }
}
