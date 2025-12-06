using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfCareerPageRepository(ApplicationDbContext dbContext) : ICareerPageRepository
{
    public Task<CareerPage?> GetAsync(CancellationToken cancellationToken = default)
    {
        return dbContext.CareerPages.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<CareerPage> UpsertAsync(CareerPage page, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.CareerPages.FirstOrDefaultAsync(cancellationToken);
        if (existing is null)
        {
            await dbContext.CareerPages.AddAsync(page, cancellationToken);
        }
        else
        {
            existing.HeaderEyebrow = page.HeaderEyebrow;
            existing.HeaderTitle = page.HeaderTitle;
            existing.HeaderSubtitle = page.HeaderSubtitle;
            existing.HeroVideoFileName = page.HeroVideoFileName;
            existing.HeroMetaLine = page.HeroMetaLine;
            existing.PrimaryCtaLabel = page.PrimaryCtaLabel;
            existing.PrimaryCtaLink = page.PrimaryCtaLink;
            existing.ResponseTime = page.ResponseTime;
            dbContext.CareerPages.Update(existing);
            page = existing;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return page;
    }
}
