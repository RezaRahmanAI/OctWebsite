using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfCompanyAboutRepository(ApplicationDbContext dbContext) : ICompanyAboutRepository
{
    public async Task<IReadOnlyList<CompanyAbout>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.CompanyAboutEntries.AsNoTracking().ToListAsync(cancellationToken);

    public Task<CompanyAbout?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        var normalizedKey = key.Trim().ToLowerInvariant();
        return dbContext.CompanyAboutEntries.AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Key.ToLower() == normalizedKey, cancellationToken);
    }
}
