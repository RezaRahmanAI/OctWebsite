using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfFaqRepository(ApplicationDbContext dbContext) : IFaqRepository
{
    public async Task<IReadOnlyList<Faq>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.Faqs.AsNoTracking().ToListAsync(cancellationToken);

    public Task<Faq?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.Faqs.AsNoTracking().FirstOrDefaultAsync(faq => faq.Id == id, cancellationToken);

    public async Task<Faq> CreateAsync(Faq faq, CancellationToken cancellationToken = default)
    {
        await dbContext.Faqs.AddAsync(faq, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return faq;
    }

    public async Task<Faq?> UpdateAsync(Faq faq, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.Faqs.AnyAsync(entry => entry.Id == faq.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.Faqs.Update(faq);
        await dbContext.SaveChangesAsync(cancellationToken);
        return faq;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.Faqs.FirstOrDefaultAsync(faq => faq.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.Faqs.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
