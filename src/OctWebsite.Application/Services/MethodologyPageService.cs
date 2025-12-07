using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class MethodologyPageService(ICompanyAboutRepository repository) : IMethodologyPageService
{
    private const string StorageKey = "methodology-page";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<MethodologyPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var storage = await LoadStorageAsync(cancellationToken);
        return MapToPageDto(storage);
    }

    public async Task<MethodologyPageDto> UpsertPageAsync(
        SaveMethodologyPageRequest request,
        CancellationToken cancellationToken = default)
    {
        Validate(request);

        var (entry, storage) = await LoadEntryAsync(cancellationToken);
        var updated = storage with { Page = request };

        await PersistAsync(entry, updated, cancellationToken);
        return MapToPageDto(updated);
    }

    public async Task<IReadOnlyList<MethodologyOfferingDto>> GetOfferingsAsync(CancellationToken cancellationToken = default)
    {
        var storage = await LoadStorageAsync(cancellationToken);
        return storage.Offerings.ToArray();
    }

    public async Task<MethodologyOfferingDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var storage = await LoadStorageAsync(cancellationToken);
        return storage.Offerings.FirstOrDefault(offering =>
            string.Equals(offering.Slug, slug, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<MethodologyOfferingDto> CreateOfferingAsync(
        SaveMethodologyOfferingRequest request,
        CancellationToken cancellationToken = default)
    {
        Validate(request);

        var (entry, storage) = await LoadEntryAsync(cancellationToken);

        if (storage.Offerings.Any(offering =>
                string.Equals(offering.Slug, request.Slug, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("An offering with the same slug already exists.");
        }

        var offering = Map(Guid.NewGuid(), request);
        var updated = storage with { Offerings = storage.Offerings.Append(offering).ToArray() };

        await PersistAsync(entry, updated, cancellationToken);
        return offering;
    }

    public async Task<MethodologyOfferingDto> UpdateOfferingAsync(
        Guid id,
        SaveMethodologyOfferingRequest request,
        CancellationToken cancellationToken = default)
    {
        Validate(request);

        var (entry, storage) = await LoadEntryAsync(cancellationToken);
        var existing = storage.Offerings.FirstOrDefault(offering => offering.Id == id)
            ?? throw new InvalidOperationException("Unable to find the specified offering.");

        if (storage.Offerings.Any(offering => offering.Id != id &&
                string.Equals(offering.Slug, request.Slug, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("Another offering already uses this slug.");
        }

        var updatedOffering = Map(existing.Id, request);
        var updated = storage with
        {
            Offerings = storage.Offerings
                .Select(offering => offering.Id == id ? updatedOffering : offering)
                .ToArray()
        };

        await PersistAsync(entry, updated, cancellationToken);
        return updatedOffering;
    }

    public async Task DeleteOfferingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var (entry, storage) = await LoadEntryAsync(cancellationToken);
        var updated = storage with { Offerings = storage.Offerings.Where(offering => offering.Id != id).ToArray() };
        await PersistAsync(entry, updated, cancellationToken);
    }

    private async Task<MethodologyPageStorage> LoadStorageAsync(CancellationToken cancellationToken)
    {
        var entry = await repository.GetByKeyAsync(StorageKey, cancellationToken)
            ?? throw new InvalidOperationException("Methodology page content has not been initialized.");

        return Deserialize(entry.Content);
    }

    private async Task<(Domain.Entities.CompanyAbout Entry, MethodologyPageStorage Storage)> LoadEntryAsync(
        CancellationToken cancellationToken)
    {
        var entry = await repository.GetByKeyAsync(StorageKey, cancellationToken)
            ?? throw new InvalidOperationException("Methodology page content has not been initialized.");

        return (entry, Deserialize(entry.Content));
    }

    private static MethodologyPageStorage Deserialize(string json)
    {
        return JsonSerializer.Deserialize<MethodologyPageStorage>(json, JsonOptions)
            ?? MethodologyPageStorage.Empty;
    }

    private async Task PersistAsync(Domain.Entities.CompanyAbout entry, MethodologyPageStorage storage, CancellationToken cancellationToken)
    {
        var updated = entry with { Content = JsonSerializer.Serialize(storage, JsonOptions) };
        _ = await repository.UpdateAsync(updated, cancellationToken)
            ?? await repository.CreateAsync(updated, cancellationToken);
    }

    private static MethodologyPageDto MapToPageDto(MethodologyPageStorage storage)
    {
        return new MethodologyPageDto(
            storage.Page.HeroHighlights,
            storage.Page.MatrixColumns,
            storage.Page.FeatureMatrix,
            storage.Page.ContactFields,
            storage.Offerings);
    }

    private static MethodologyOfferingDto Map(Guid id, SaveMethodologyOfferingRequest request)
    {
        return new MethodologyOfferingDto(
            id,
            request.Slug,
            request.Badge,
            request.Headline,
            request.Subheadline,
            request.Intro,
            request.Stats,
            request.Benefits,
            request.Process,
            request.Closing,
            request.Active);
    }

    private static void Validate(SaveMethodologyPageRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (request.MatrixColumns.Any(column => string.IsNullOrWhiteSpace(column.Key)))
        {
            throw new ArgumentException("All matrix columns must include a key.", nameof(request));
        }
    }

    private static void Validate(SaveMethodologyOfferingRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Slug))
        {
            throw new ArgumentException("A slug is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Badge))
        {
            throw new ArgumentException("A badge is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Headline))
        {
            throw new ArgumentException("A headline is required.", nameof(request));
        }
    }
}
