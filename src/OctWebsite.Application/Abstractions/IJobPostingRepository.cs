using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IJobPostingRepository
{
    Task<IReadOnlyList<JobPosting>> GetOpenAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<JobPosting>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<JobPosting?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<JobPosting> CreateAsync(JobPosting posting, CancellationToken cancellationToken = default);
    Task<JobPosting?> UpdateAsync(JobPosting posting, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
