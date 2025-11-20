import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ContentService } from '../../core/services/content.service';
import { HomeContactComponent } from "../home/sections/contact/home-contact.component";

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
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HomeContactComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly content = inject(ContentService);

  protected readonly contactData = computed(() => this.content.homeContent().contact);
  protected readonly contactPage = this.content.getPageSignal<ContactPageContent>('contact');
}
