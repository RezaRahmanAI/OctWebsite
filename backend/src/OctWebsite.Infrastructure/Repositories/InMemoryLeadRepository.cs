using System.Collections.Concurrent;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemoryLeadRepository : ILeadRepository
{
    private readonly ConcurrentDictionary<Guid, Lead> _leads = new();

    public Task<IReadOnlyList<Lead>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var ordered = _leads.Values.OrderByDescending(lead => lead.CreatedAt).ToArray();
        return Task.FromResult<IReadOnlyList<Lead>>(ordered);
    }

    public Task<Lead?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _leads.TryGetValue(id, out var lead);
        return Task.FromResult(lead);
    }

    public Task<Lead> CreateAsync(Lead lead, CancellationToken cancellationToken = default)
    {
        _leads[lead.Id] = lead;
        return Task.FromResult(lead);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_leads.TryRemove(id, out _));
    }
}
