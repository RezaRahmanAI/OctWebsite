using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

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
}
