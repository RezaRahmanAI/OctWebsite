using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class AboutService(ICompanyAboutRepository repository) : IAboutService
{
    public async Task<IReadOnlyList<CompanyAboutDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var sections = await repository.GetAllAsync(cancellationToken);
        return sections.Select(section => section.ToDto()).ToArray();
    }

    public async Task<CompanyAboutDto?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ArgumentException("Key is required", nameof(key));
        }

        var section = await repository.GetByKeyAsync(key, cancellationToken);
        return section?.ToDto();
    }

    public async Task<CompanyAboutDto> CreateAsync(SaveCompanyAboutRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var about = new CompanyAbout(Guid.NewGuid(), request.Key.Trim(), request.Content.Trim());
        var created = await repository.CreateAsync(about, cancellationToken);
        return created.ToDto();
    }

    public async Task<CompanyAboutDto?> UpdateAsync(Guid id, SaveCompanyAboutRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with { Key = request.Key.Trim(), Content = request.Content.Trim() };
        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveCompanyAboutRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Key);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Content);
    }
}
