using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IFaqService
{
    Task<IReadOnlyList<FaqDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<FaqDto> CreateAsync(SaveFaqRequest request, CancellationToken cancellationToken = default);
    Task<FaqDto?> UpdateAsync(Guid id, SaveFaqRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
