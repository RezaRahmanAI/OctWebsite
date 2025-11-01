using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface ILeadService
{
    Task<IReadOnlyList<LeadDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<LeadDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<LeadDto> CreateAsync(CreateLeadRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record CreateLeadRequest(
    string Name,
    string Email,
    string? Phone,
    string? Subject,
    string Message
);
