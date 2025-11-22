import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { CtaLink, FooterContent } from '../../core/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  private readonly contentService = inject(ContentService);
  protected readonly currentYear = new Date().getFullYear();

  private readonly emptyFooter: FooterContent = {
    brand: {
      name: '',
      partner: '',
      logo: '',
      description: '',
      consultationCta: { label: '', routerLink: '/' },
    },
    sections: [],
    socialLinks: [],
    legalLinks: [],
  };

  protected readonly footer = computed(() => this.contentService.footerContent() ?? this.emptyFooter);

  protected isExternal(link: CtaLink): boolean {
    return !!link.externalUrl;
  }

  protected trackByLabel(_: number, item: CtaLink): string {
    return item.label;
  }
}
