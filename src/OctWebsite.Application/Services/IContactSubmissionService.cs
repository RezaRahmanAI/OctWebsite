using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IContactSubmissionService
{
    Task<ContactSubmissionDto> SubmitAsync(SubmitContactFormRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ContactSubmissionDto>> GetRecentAsync(int take = 200, CancellationToken cancellationToken = default);
}
