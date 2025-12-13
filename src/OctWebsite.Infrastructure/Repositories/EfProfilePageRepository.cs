using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfProfilePageRepository(ApplicationDbContext context) : IProfilePageRepository
{
    public Task<ProfilePage?> GetAsync(CancellationToken cancellationToken = default)
    {
        return context.ProfilePages.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<ProfilePage> UpsertAsync(ProfilePage page, CancellationToken cancellationToken = default)
    {
        var existing = await context.ProfilePages.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
        if (existing is null)
        {
            await context.ProfilePages.AddAsync(page, cancellationToken);
        }
        else
        {
            context.ProfilePages.Update(page);
        }

        await context.SaveChangesAsync(cancellationToken);
        return page;
    }
}
