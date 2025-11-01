using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemoryCompanyAboutRepository : ICompanyAboutRepository
{
    public Task<IReadOnlyList<CompanyAbout>> GetAllAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<CompanyAbout>>(SeedData.About);

    public Task<CompanyAbout?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        var normalizedKey = key.Trim().ToLowerInvariant();
        var about = SeedData.About.FirstOrDefault(section => section.Key.Equals(normalizedKey, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(about);
    }
}
