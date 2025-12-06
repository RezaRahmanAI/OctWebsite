using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface ICareerService
{
    Task<IReadOnlyList<JobPostingDto>> GetOpenAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<JobPostingDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<JobPostingDto> CreatePostingAsync(SaveJobPostingRequest request, CancellationToken cancellationToken = default);
    Task<JobPostingDto?> UpdatePostingAsync(Guid id, SaveJobPostingRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeletePostingAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CareerApplicationDto> SubmitApplicationAsync(SubmitCareerApplicationRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CareerApplicationDto>> GetRecentApplicationsAsync(int take = 200, CancellationToken cancellationToken = default);
}
