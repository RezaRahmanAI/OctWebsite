using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfCareerApplicationRepository(ApplicationDbContext dbContext) : ICareerApplicationRepository
{
    public async Task<CareerApplication> CreateAsync(CareerApplication application, CancellationToken cancellationToken = default)
    {
        await dbContext.CareerApplications.AddAsync(application, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return application;
    }

    public async Task<IReadOnlyList<CareerApplication>> GetRecentAsync(int take, CancellationToken cancellationToken = default)
    {
        return await dbContext.CareerApplications
            .Include(application => application.JobPosting)
            .OrderByDescending(application => application.CreatedAt)
            .ThenByDescending(application => application.Id)
            .Take(take)
            .ToListAsync(cancellationToken);
    }
}
