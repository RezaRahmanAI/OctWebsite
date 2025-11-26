using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ContactPageService(ICompanyAboutRepository repository) : IContactPageService
{
    private const string StorageKey = "contact-page";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<ContactPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return Deserialize(stored.Content, stored.Id);
    }

    public async Task<ContactPageDto> UpsertAsync(
        SaveContactPageRequest request,
        CancellationToken cancellationToken = default)
    {
        Validate(request);

        var serialized = Serialize(request);
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (existing is null)
        {
            var created = new CompanyAbout(Guid.NewGuid(), StorageKey, serialized);
            await repository.CreateAsync(created, cancellationToken);
            return Deserialize(created.Content, created.Id);
        }

        var updated = existing with { Content = serialized };
        await repository.UpdateAsync(updated, cancellationToken);
        return Deserialize(updated.Content, updated.Id);
    }

    private async Task<ContactPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = new SaveContactPageRequest(
            "Contact",
            "Partner with ObjectCanvas × Bangladesh",
            "Share your goals and we will prepare a tailored action plan, timeline, and resourcing model.",
            null,
            "Schedule a discovery call, request a proposal, or invite us to an RFP.",
            "Dhaka · Singapore · Dubai · London · Toronto",
            new[]
            {
                "partnerships@objectcanvas.com",
                "admissions@.com",
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
            "We respond within 24 business hours. For urgent queries, call +880 1315-220077.");

        return await UpsertAsync(defaults, cancellationToken);
    }

    private static string Serialize(SaveContactPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private static ContactPageDto Deserialize(string json, Guid? id = null)
    {
        var stored = JsonSerializer.Deserialize<SaveContactPageRequest>(json, JsonOptions)
            ?? throw new InvalidOperationException("Unable to deserialize contact page content.");

        return new ContactPageDto(
            id ?? Guid.NewGuid(),
            stored.HeaderEyebrow,
            stored.HeaderTitle,
            stored.HeaderSubtitle,
            CreateMedia(stored.HeroVideoFileName),
            stored.ConsultationOptions,
            stored.RegionalSupport,
            stored.Emails.ToArray(),
            stored.FormOptions.ToArray(),
            stored.NdaLabel,
            stored.ResponseTime);
    }

    private static void Validate(SaveContactPageRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderEyebrow);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderSubtitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ConsultationOptions);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.RegionalSupport);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.NdaLabel);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ResponseTime);
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
