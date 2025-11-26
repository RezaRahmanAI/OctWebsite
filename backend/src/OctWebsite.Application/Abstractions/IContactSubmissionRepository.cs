using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IContactSubmissionRepository
{
    Task<ContactSubmission> CreateAsync(ContactSubmission submission, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ContactSubmission>> GetRecentAsync(int take, CancellationToken cancellationToken = default);
}
