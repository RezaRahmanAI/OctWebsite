using System;
using System.Collections.Generic;

namespace OctWebsite.Application.DTOs;

public sealed record SocialLinkDto(string Label, string Url);

public sealed record WhatsappChannelDto(string Label, string Number, string Url);

public sealed record ContactChannelsDto(
    IReadOnlyList<SocialLinkDto> SocialLinks,
    string LocalPhoneNumber,
    string InternationalPhoneNumber,
    WhatsappChannelDto LocalWhatsapp,
    WhatsappChannelDto InternationalWhatsapp,
    string BusinessEmail,
    string SupportEmail);

public sealed record SaveContactChannelsRequest(
    IReadOnlyList<SocialLinkDto> SocialLinks,
    string LocalPhoneNumber,
    string InternationalPhoneNumber,
    WhatsappChannelDto LocalWhatsapp,
    WhatsappChannelDto InternationalWhatsapp,
    string BusinessEmail,
    string SupportEmail);

public sealed record ContactPageDto(
    Guid Id,
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    MediaResourceDto? HeroVideo,
    string HeroMetaLine,
    string PrimaryCtaLabel,
    string PrimaryCtaLink,
    string ConsultationOptions,
    string RegionalSupport,
    IReadOnlyList<string> Emails,
    IReadOnlyList<string> FormOptions,
    string NdaLabel,
    string ResponseTime,
    string OfficesEyebrow,
    string OfficesTitle,
    string OfficesDescription,
    IReadOnlyList<ContactOfficeDto> Offices,
    string MapEmbedUrl,
    string MapTitle,
    string Headquarters,
    IReadOnlyList<string> BusinessHours,
    string ProfileDownloadLabel,
    string ProfileDownloadUrl);

public sealed record SaveContactPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string? HeroVideoFileName,
    string HeroMetaLine,
    string PrimaryCtaLabel,
    string PrimaryCtaLink,
    string ConsultationOptions,
    string RegionalSupport,
    IReadOnlyList<string> Emails,
    IReadOnlyList<string> FormOptions,
    string NdaLabel,
    string ResponseTime,
    string OfficesEyebrow,
    string OfficesTitle,
    string OfficesDescription,
    IReadOnlyList<ContactOfficeDto> Offices,
    string MapEmbedUrl,
    string MapTitle,
    string Headquarters,
    IReadOnlyList<string> BusinessHours,
    string ProfileDownloadLabel,
    string ProfileDownloadUrl);

public sealed record ContactOfficeDto(
    string Name,
    string Headline,
    string Address,
    string ImageUrl);
