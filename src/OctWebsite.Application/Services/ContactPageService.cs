using System;
using System.Collections.Generic;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ContactPageService(IContactPageRepository repository) : IContactPageService
{
    public async Task<ContactPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetAsync(cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return MapToDto(stored);
    }

    public async Task<ContactPageDto> UpsertAsync(
        SaveContactPageRequest request,
        CancellationToken cancellationToken = default)
    {
        Validate(request);

        var existing = await repository.GetAsync(cancellationToken);
        var entity = MapToEntity(existing, request);
        var saved = await repository.UpsertAsync(entity, cancellationToken);
        return MapToDto(saved);
    }

    private async Task<ContactPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = new SaveContactPageRequest(
            "Contact",
            "Partner with ObjectCanvas × Bangladesh",
            "Share your goals and we will prepare a tailored action plan, timeline, and resourcing model.",
            "video/contact.mp4",
            "Dhaka · Rajshahi · Remote",
            "Hire Our Team →",
            "/contact#consultation",
            "Schedule a discovery call, request a proposal, or invite us to an RFP.",
            "Dhaka · Singapore · Dubai · London · Toronto",
            new[]
            {
                "partnerships@objectcanvas.com",
                "admissions@objectcanvas.com",
                "support@objectcanvas.com"
            },
            new[]
            {
                "Digital Marketing",
                "Software Development",
                "Website Building",
                "ObjectCanvas Academy Programs",
                "General Inquiry"
            },
            "I would like to sign an NDA prior to sharing sensitive information.",
            "We respond within 24 business hours. For urgent queries, call +880 1315-220077.",
            "Our Awesome Offices",
            "Visit our teams in Bangladesh",
            "Drop by our offices or host a hybrid session with our Dhaka and Rajshahi teams.",
            new[]
            {
                new ContactOfficeDto(
                    "Dhaka Office",
                    "Ahmed Tower, Kemal Ataturk Ave",
                    "Floor #11, 16 & 19 Ahmed Tower, 28–30 Kemal Ataturk Ave, Dhaka 1213, Bangladesh.",
                    "/images/offices/dhaka-office.webp"),
                new ContactOfficeDto(
                    "Rajshahi Office",
                    "Nilanjona (1st Floor)",
                    "Nilanjona (1st Floor), 627–Ramchandrapur, Rajshahi 6100, Bangladesh.",
                    "/images/offices/rajshahi-office.webp")
            },
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d271.37367831960273!2d90.35626366665193!3d23.777513710494645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1f1d9ab7727%3A0x8e94cd99451a6bc0!2sAJWA%20Int.%20Ltd.%20Basic%20Nigar!5e0!3m2!1sen!2sbd!4v1765258190683!5m2!1sen!2sbd",
            "ObjectCanvas Bangladesh locations",
            "ObjectCanvas Studios & ObjectCanvas Academy, 12/2 Innovation Avenue, Tejgaon, Dhaka 1207",
            new[]
            {
                "Sun-Thu: 9:00 AM - 6:00 PM (GMT+6)",
                "Fri-Sat: Closed"
            },
            "Download Company Profile (PDF)",
            "https://objectcanvas.com/company-profile.pdf");

        return await UpsertAsync(defaults, cancellationToken);
    }

    private static ContactPage MapToEntity(ContactPage? existing, SaveContactPageRequest request)
    {
        var entity = existing ?? new ContactPage { Id = Guid.NewGuid() };

        entity.HeaderEyebrow = request.HeaderEyebrow.Trim();
        entity.HeaderTitle = request.HeaderTitle.Trim();
        entity.HeaderSubtitle = request.HeaderSubtitle.Trim();
        entity.HeroVideoFileName = string.IsNullOrWhiteSpace(request.HeroVideoFileName)
            ? null
            : request.HeroVideoFileName.Trim();
        entity.HeroMetaLine = request.HeroMetaLine.Trim();
        entity.PrimaryCtaLabel = request.PrimaryCtaLabel.Trim();
        entity.PrimaryCtaLink = request.PrimaryCtaLink.Trim();
        entity.ConsultationOptions = request.ConsultationOptions.Trim();
        entity.RegionalSupport = request.RegionalSupport.Trim();
        entity.Emails = request.Emails.Select(email => email.Trim()).ToList();
        entity.FormOptions = request.FormOptions.Select(option => option.Trim()).ToList();
        entity.NdaLabel = request.NdaLabel.Trim();
        entity.ResponseTime = request.ResponseTime.Trim();
        entity.OfficesEyebrow = request.OfficesEyebrow.Trim();
        entity.OfficesTitle = request.OfficesTitle.Trim();
        entity.OfficesDescription = request.OfficesDescription.Trim();
        entity.Offices = request.Offices.Select(MapToEntity).ToList();
        entity.MapEmbedUrl = request.MapEmbedUrl.Trim();
        entity.MapTitle = request.MapTitle.Trim();
        entity.Headquarters = request.Headquarters.Trim();
        entity.BusinessHours = request.BusinessHours.Select(hour => hour.Trim()).ToList();
        entity.ProfileDownloadLabel = request.ProfileDownloadLabel.Trim();
        entity.ProfileDownloadUrl = request.ProfileDownloadUrl.Trim();

        return entity;
    }

    private static ContactOffice MapToEntity(ContactOfficeDto dto)
    {
        var storedPath = string.IsNullOrWhiteSpace(dto.ImageFileName) ? dto.ImageUrl : dto.ImageFileName;
        return new ContactOffice(
            dto.Name.Trim(),
            dto.Headline.Trim(),
            dto.Address.Trim(),
            storedPath.Trim());
    }

    private static ContactPageDto MapToDto(ContactPage page) => new(
        page.Id,
        page.HeaderEyebrow,
        page.HeaderTitle,
        page.HeaderSubtitle,
        CreateMedia(page.HeroVideoFileName),
        page.HeroMetaLine,
        page.PrimaryCtaLabel,
        page.PrimaryCtaLink,
        page.ConsultationOptions,
        page.RegionalSupport,
        page.Emails,
        page.FormOptions,
        page.NdaLabel,
        page.ResponseTime,
        page.OfficesEyebrow,
        page.OfficesTitle,
        page.OfficesDescription,
        page.Offices.Select(MapToDto).ToArray(),
        page.MapEmbedUrl,
        page.MapTitle,
        page.Headquarters,
        page.BusinessHours,
        page.ProfileDownloadLabel,
        page.ProfileDownloadUrl);

    private static ContactOfficeDto MapToDto(ContactOffice office) => new(
        office.Name,
        office.Headline,
        office.Address,
        office.ImageUrl,
        office.ImageUrl);

    private static void Validate(SaveContactPageRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderEyebrow);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderSubtitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeroMetaLine);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.PrimaryCtaLabel);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.PrimaryCtaLink);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ConsultationOptions);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.RegionalSupport);
        if (request.Emails.Count == 0)
        {
            throw new ArgumentException("At least one contact email is required.");
        }

        if (request.FormOptions.Count == 0)
        {
            throw new ArgumentException("At least one contact form option is required.");
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(request.NdaLabel);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ResponseTime);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.OfficesEyebrow);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.OfficesTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.OfficesDescription);
        if (request.Offices.Count == 0)
        {
            throw new ArgumentException("At least one office location is required.");
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(request.MapEmbedUrl);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.MapTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Headquarters);
        if (request.BusinessHours.Count == 0)
        {
            throw new ArgumentException("Business hours are required.");
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(request.ProfileDownloadLabel);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ProfileDownloadUrl);
    }

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }
}
