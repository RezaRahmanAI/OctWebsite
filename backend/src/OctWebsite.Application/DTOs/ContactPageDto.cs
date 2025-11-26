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
    string ConsultationOptions,
    string RegionalSupport,
    IReadOnlyList<string> Emails,
    IReadOnlyList<string> FormOptions,
    string NdaLabel,
    string ResponseTime);

public sealed record SaveContactPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string? HeroVideoFileName,
    string ConsultationOptions,
    string RegionalSupport,
    IReadOnlyList<string> Emails,
    IReadOnlyList<string> FormOptions,
    string NdaLabel,
    string ResponseTime);
