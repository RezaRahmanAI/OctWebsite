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

    public Task<CompanyAbout?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.CompanyAboutEntries.AsNoTracking().FirstOrDefaultAsync(entry => entry.Id == id, cancellationToken);

    public async Task<CompanyAbout> CreateAsync(CompanyAbout about, CancellationToken cancellationToken = default)
    {
        await dbContext.CompanyAboutEntries.AddAsync(about, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return about;
    }

    public async Task<CompanyAbout?> UpdateAsync(CompanyAbout about, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.CompanyAboutEntries.AnyAsync(entry => entry.Id == about.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.CompanyAboutEntries.Update(about);
        await dbContext.SaveChangesAsync(cancellationToken);
        return about;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.CompanyAboutEntries.FirstOrDefaultAsync(entry => entry.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.CompanyAboutEntries.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
