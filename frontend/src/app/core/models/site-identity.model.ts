export interface SocialLink {
  label: string;
  url: string;
}

export interface WhatsappChannel {
  label: string;
  number: string;
  url: string;
}

export interface SiteContactChannels {
  socialLinks: SocialLink[];
  phoneNumbers: {
    local: string;
    international: string;
  };
  whatsapp: {
    local: WhatsappChannel;
    international: WhatsappChannel;
  };
  businessEmail: string;
  supportEmail: string;
}

export interface HeroVideoConfig {
  page: string;
  src: string;
  poster: string;
  caption?: string;
}
