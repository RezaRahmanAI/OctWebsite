using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfContactSubmissionRepository(ApplicationDbContext dbContext) : IContactSubmissionRepository
{
    public async Task<ContactSubmission> CreateAsync(ContactSubmission submission, CancellationToken cancellationToken = default)
    {
        await dbContext.ContactSubmissions.AddAsync(submission, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return submission;
    }

    public async Task<IReadOnlyList<ContactSubmission>> GetRecentAsync(int take, CancellationToken cancellationToken = default)
    {
        return await dbContext.ContactSubmissions
            .OrderByDescending(submission => submission.CreatedAt)
            .ThenByDescending(submission => submission.Id)
            .Take(take)
            .ToListAsync(cancellationToken);
    }
}
