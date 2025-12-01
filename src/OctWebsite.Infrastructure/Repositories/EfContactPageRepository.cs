using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfContactPageRepository(ApplicationDbContext dbContext) : IContactPageRepository
{
    public Task<ContactPage?> GetAsync(CancellationToken cancellationToken = default)
    {
        return dbContext.ContactPages
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<ContactPage> UpsertAsync(ContactPage page, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.ContactPages
            .FirstOrDefaultAsync(p => p.Id == page.Id, cancellationToken);

        if (existing is null)
        {
            await dbContext.ContactPages.AddAsync(page, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            return page;
        }
        existing.HeaderEyebrow = page.HeaderEyebrow;
        existing.HeaderTitle = page.HeaderTitle;
        existing.HeaderSubtitle = page.HeaderSubtitle;
        existing.HeroVideoFileName = page.HeroVideoFileName;
        existing.HeroMetaLine = page.HeroMetaLine;
        existing.PrimaryCtaLabel = page.PrimaryCtaLabel;
        existing.PrimaryCtaLink = page.PrimaryCtaLink;
        existing.ConsultationOptions = page.ConsultationOptions;
        existing.RegionalSupport = page.RegionalSupport;
        existing.Emails = page.Emails;
        existing.FormOptions = page.FormOptions;
        existing.NdaLabel = page.NdaLabel;
        existing.ResponseTime = page.ResponseTime;
        existing.OfficesEyebrow = page.OfficesEyebrow;
        existing.OfficesTitle = page.OfficesTitle;
        existing.OfficesDescription = page.OfficesDescription;
        existing.Offices = page.Offices;
        existing.MapEmbedUrl = page.MapEmbedUrl;
        existing.MapTitle = page.MapTitle;
        existing.Headquarters = page.Headquarters;
        existing.BusinessHours = page.BusinessHours;
        existing.ProfileDownloadLabel = page.ProfileDownloadLabel;
        existing.ProfileDownloadUrl = page.ProfileDownloadUrl;

        dbContext.ContactPages.Update(existing);
        await dbContext.SaveChangesAsync(cancellationToken);

        return existing;
    }
}
