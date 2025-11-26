using System;
using System.IO;
using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class HomePageService(ICompanyAboutRepository repository) : IHomePageService
{
    private const string StorageKey = "home-page";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = false
    };

    public async Task<HomePageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (existing is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return Deserialize(existing.Content, existing.Id);
    }

    public async Task<HomePageDto> UpsertAsync(SaveHomePageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var serialized = Serialize(request.Content);
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

    private async Task<HomePageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var content = CreateDefaultContent();
        var request = new SaveHomePageRequest(content);
        return await UpsertAsync(request, cancellationToken);
    }

    private static void Validate(SaveHomePageRequest request)
    {
        if (request.Content.RootElement.ValueKind == JsonValueKind.Undefined)
        {
            throw new ArgumentException("Home page content is required", nameof(request));
        }
    }

    private static string Serialize(JsonDocument document)
    {
        using var stream = new MemoryStream();
        using var writer = new Utf8JsonWriter(stream);
        document.WriteTo(writer);
        writer.Flush();
        return System.Text.Encoding.UTF8.GetString(stream.ToArray());
    }

    private static HomePageDto Deserialize(string json, Guid? id = null)
    {
        var document = JsonDocument.Parse(string.IsNullOrWhiteSpace(json) ? "{}" : json);
        return new HomePageDto(id ?? Guid.NewGuid(), document);
    }

    private static JsonDocument CreateDefaultContent()
    {
        var template = new
        {
            hero = new
            {
                badge = "ObjectCanvas · Bangladesh",
                title = "Build with a product studio and academy in one team",
                description = "We design, engineer, and teach side-by-side so every engagement ships outcomes and capability.",
                primaryCta = new { label = "Talk to us", link = "/contact" },
                secondaryCta = new { label = "View services", link = "/services" },
                highlightList = new[]
                {
                    "Product strategy & delivery",
                    "Cloud, security & platform",
                    "Training and capability building"
                }
            },
            trust = new
            {
                tagline = "Trusted by founders, enterprises, and universities",
                companies = new[] { "ObjectCanvas", "Academy", "Global Partners" },
                stats = new[]
                {
                    new { label = "Projects shipped", value = 120 },
                    new { label = "Learners coached", value = 2500 },
                    new { label = "Countries served", value = 6 }
                }
            },
            services = new
            {
                header = new { title = "Featured services", subtitle = "What we deliver" },
                items = new[]
                {
                    new { title = "Web Application", icon = "🌐", description = "Enterprise-ready web platforms.", highlights = new[]{"Design systems","Secure APIs"}, tagline = "Build products fast" },
                    new { title = "Cloud Services", icon = "☁️", description = "Landing zones and FinOps.", highlights = new[]{"IaC","Observability"}, tagline = "Scale reliably" }
                }
            },
            testimonials = new
            {
                header = new { title = "What partners say", align = "center" },
                items = new[]
                {
                    new { quote = "They ship outcomes while teaching our team.", name = "Engagement Lead", title = "Enterprise client", location = "Dhaka", rating = 5, type = "client" }
                }
            },
            closingCtas = new
            {
                business = new { title = "Ready to launch?", description = "Partner with our product studio for your next release.", cta = new { label = "Book a call", link = "/contact" } },
                academy = new { title = "Grow your team", description = "Upskill engineers with our academy programs.", cta = new { label = "Explore courses", link = "/academy" } }
            }
        };

        var json = JsonSerializer.Serialize(template, JsonOptions);
        return JsonDocument.Parse(json);
    }
}
