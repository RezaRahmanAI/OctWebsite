using System;
using System.Collections.Generic;

namespace OctWebsite.Domain.Entities;

public sealed class ContactPage
{
    public Guid Id { get; init; }

    public string HeaderEyebrow { get; set; } = string.Empty;

    public string HeaderTitle { get; set; } = string.Empty;

    public string HeaderSubtitle { get; set; } = string.Empty;

    public string? HeroVideoFileName { get; set; }

    public string HeroMetaLine { get; set; } = string.Empty;

    public string PrimaryCtaLabel { get; set; } = string.Empty;

    public string PrimaryCtaLink { get; set; } = string.Empty;

    public string ConsultationOptions { get; set; } = string.Empty;

    public string RegionalSupport { get; set; } = string.Empty;

    public List<string> Emails { get; set; } = new();

    public List<string> FormOptions { get; set; } = new();

    public string NdaLabel { get; set; } = string.Empty;

    public string ResponseTime { get; set; } = string.Empty;

    public string OfficesEyebrow { get; set; } = string.Empty;

    public string OfficesTitle { get; set; } = string.Empty;

    public string OfficesDescription { get; set; } = string.Empty;

    public List<ContactOffice> Offices { get; set; } = new();

    public string MapEmbedUrl { get; set; } = string.Empty;

    public string MapTitle { get; set; } = string.Empty;

    public string Headquarters { get; set; } = string.Empty;

    public List<string> BusinessHours { get; set; } = new();

    public string ProfileDownloadLabel { get; set; } = string.Empty;

    public string ProfileDownloadUrl { get; set; } = string.Empty;
}
