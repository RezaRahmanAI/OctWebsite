using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemoryServiceRepository : IServiceRepository
{
    public Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<ServiceItem>>(SeedData.Services);

    public Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        var service = SeedData.Services.FirstOrDefault(service => service.Slug.Equals(normalizedSlug, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(service);
    }
}
