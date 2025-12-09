import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContentService } from './content.service';
import { SiteIdentityService } from './site-identity.service';
import { SiteContactChannels } from '../models/site-identity.model';

export interface SocialLinkModel {
  label: string;
  url: string;
}

export interface WhatsappChannelModel {
  label: string;
  number: string;
  url: string;
}

export interface ContactChannelsModel {
  socialLinks: SocialLinkModel[];
  localPhoneNumber: string;
  internationalPhoneNumber: string;
  localWhatsapp: WhatsappChannelModel;
  internationalWhatsapp: WhatsappChannelModel;
  businessEmail: string;
  supportEmail: string;
}

@Injectable({ providedIn: 'root' })
export class ContactChannelsApiService {
  private readonly http = inject(HttpClient);
  private readonly content = inject(ContentService);
  private readonly identity = inject(SiteIdentityService);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly channels = signal<ContactChannelsModel | null>(null);

  load(): void {
    this.fetch().subscribe();
  }

  fetch(): Observable<ContactChannelsModel> {
    return this.http.get<ContactChannelsModel>(`${this.baseUrl}/api/contact-channels`).pipe(
      tap((channels) => {
        this.channels.set(channels);
        this.applyToIdentity(channels);
      })
    );
  }

  update(request: ContactChannelsModel): Observable<ContactChannelsModel> {
    return this.http
      .post<ContactChannelsModel>(`${this.baseUrl}/api/contact-channels`, request)
      .pipe(
        tap((channels) => {
          this.channels.set(channels);
          this.applyToIdentity(channels);
        })
      );
  }

  private applyToIdentity(channels: ContactChannelsModel): void {
    const mapped: SiteContactChannels = {
      socialLinks: channels.socialLinks.map((link) => ({ ...link })),
      phoneNumbers: {
        local: channels.localPhoneNumber,
        international: channels.internationalPhoneNumber,
      },
      whatsapp: {
        local: { ...channels.localWhatsapp },
        international: { ...channels.internationalWhatsapp },
      },
      businessEmail: channels.businessEmail,
      supportEmail: channels.supportEmail,
    };

    this.identity.updateContactChannels(mapped);
    this.content.applyContactChannels(mapped);
  }
}
