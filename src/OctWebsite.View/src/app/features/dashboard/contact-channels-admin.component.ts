import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactChannelsApiService, ContactChannelsModel, SocialLinkModel, WhatsappChannelModel } from '../../core/services/contact-channels-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact-channels-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-channels-admin.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class ContactChannelsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ContactChannelsApiService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    localPhoneNumber: ['', Validators.required],
    internationalPhoneNumber: ['', Validators.required],
    businessEmail: ['', [Validators.required, Validators.email]],
    supportEmail: ['', [Validators.required, Validators.email]],
    localWhatsapp: this.fb.group({
      label: this.fb.nonNullable.control('', Validators.required),
      number: this.fb.nonNullable.control('', Validators.required),
      url: this.fb.nonNullable.control('', Validators.required),
    }),
    internationalWhatsapp: this.fb.group({
      label: this.fb.nonNullable.control('', Validators.required),
      number: this.fb.nonNullable.control('', Validators.required),
      url: this.fb.nonNullable.control('', Validators.required),
    }),
    socialLinks: this.fb.array([]),
  });

  ngOnInit(): void {
    this.load();
  }

  get socialLinks(): FormArray {
    return this.form.get('socialLinks') as FormArray;
  }

  addSocialLink(link?: SocialLinkModel): void {
    this.socialLinks.push(
      this.fb.group({
        label: [link?.label ?? '', Validators.required],
        url: [link?.url ?? '', Validators.required],
      })
    );
  }

  removeSocialLink(index: number): void {
    this.socialLinks.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const payload = this.toModel();
    this.api.update(payload).subscribe({
      next: (channels) => {
        this.apply(channels);
        this.toast.show('Contact channels saved', 'success');
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Failed to save contact channels', 'error');
        this.loading.set(false);
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.api.fetch().subscribe({
      next: (channels) => {
        this.apply(channels);
        this.loading.set(false);
      },
      error: () => {
        this.toast.show('Unable to load contact channels', 'error');
        this.loading.set(false);
      },
    });
  }

  private apply(channels: ContactChannelsModel): void {
    this.form.patchValue({
      localPhoneNumber: channels.localPhoneNumber,
      internationalPhoneNumber: channels.internationalPhoneNumber,
      businessEmail: channels.businessEmail,
      supportEmail: channels.supportEmail,
      localWhatsapp: { ...channels.localWhatsapp },
      internationalWhatsapp: { ...channels.internationalWhatsapp },
    });

    this.socialLinks.clear();
    channels.socialLinks.forEach(link => this.addSocialLink(link));
  }

  private toModel(): ContactChannelsModel {
    const raw = this.form.value;
    return {
      localPhoneNumber: raw.localPhoneNumber ?? '',
      internationalPhoneNumber: raw.internationalPhoneNumber ?? '',
      businessEmail: raw.businessEmail ?? '',
      supportEmail: raw.supportEmail ?? '',
      localWhatsapp: {
        label: (raw.localWhatsapp as WhatsappChannelModel | undefined)?.label ?? '',
        number: (raw.localWhatsapp as WhatsappChannelModel | undefined)?.number ?? '',
        url: (raw.localWhatsapp as WhatsappChannelModel | undefined)?.url ?? '',
      },
      internationalWhatsapp: {
        label: (raw.internationalWhatsapp as WhatsappChannelModel | undefined)?.label ?? '',
        number: (raw.internationalWhatsapp as WhatsappChannelModel | undefined)?.number ?? '',
        url: (raw.internationalWhatsapp as WhatsappChannelModel | undefined)?.url ?? '',
      },
      socialLinks: this.socialLinks.controls.map(control => ({
        label: control.value.label ?? '',
        url: control.value.url ?? '',
      })),
    };
  }
}
