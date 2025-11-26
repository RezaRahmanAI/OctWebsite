using System;
using System.Linq;
using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ContactChannelsService(ICompanyAboutRepository repository) : IContactChannelsService
{
    private const string StorageKey = "contact-channels";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<ContactChannelsDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return Deserialize(stored.Content, stored.Id);
    }

    public async Task<ContactChannelsDto> UpsertAsync(
        SaveContactChannelsRequest request,
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

    private async Task<ContactChannelsDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = new SaveContactChannelsRequest(
            new[]
            {
                new SocialLinkDto("LinkedIn", "https://www.linkedin.com/company/objectcanvas"),
                new SocialLinkDto("Facebook", "https://www.facebook.com/objectcanvas"),
                new SocialLinkDto("Twitter", "https://twitter.com/objectcanvas"),
                new SocialLinkDto("Instagram", "https://www.instagram.com/objectcanvas"),
                new SocialLinkDto("YouTube", "https://www.youtube.com/@"),
                new SocialLinkDto("GitHub", "https://github.com/objectcanvas"),
            },
            "+880 1315-220077",
            "+1 415-915-0198",
            new WhatsappChannelDto("WhatsApp (Bangladesh)", "+880 1315-220077", "https://wa.me/8801315220077"),
            new WhatsappChannelDto("WhatsApp (International)", "+1 415-915-0198", "https://wa.me/14159150198"),
            "partnerships@objectcanvas.com",
            "support@objectcanvas.com");

        return await UpsertAsync(defaults, cancellationToken);
    }

    private static string Serialize(SaveContactChannelsRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private static ContactChannelsDto Deserialize(string json, Guid? id = null)
    {
        var stored = JsonSerializer.Deserialize<SaveContactChannelsRequest>(json, JsonOptions)
            ?? throw new InvalidOperationException("Unable to deserialize contact channel settings.");

        return new ContactChannelsDto(
            stored.SocialLinks.ToArray(),
            stored.LocalPhoneNumber,
            stored.InternationalPhoneNumber,
            stored.LocalWhatsapp,
            stored.InternationalWhatsapp,
            stored.BusinessEmail,
            stored.SupportEmail);
    }

    private static void Validate(SaveContactChannelsRequest request)
    {
        if (request.SocialLinks.Count == 0)
        {
            throw new ArgumentException("At least one social link is required.");
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(request.LocalPhoneNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.InternationalPhoneNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.LocalWhatsapp?.Number);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.LocalWhatsapp?.Url);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.InternationalWhatsapp?.Number);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.InternationalWhatsapp?.Url);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.BusinessEmail);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.SupportEmail);
    }
}
