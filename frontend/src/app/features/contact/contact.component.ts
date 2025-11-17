import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HomeContactComponent } from '../home/sections/contact/home-contact.component';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HomeContactComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly content = inject(ContentService);

  protected readonly contactData = computed(() => this.content.homeContent().contact);
}
