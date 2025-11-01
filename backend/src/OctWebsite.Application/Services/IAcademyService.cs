using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IAcademyService
{
    Task<IReadOnlyList<AcademyTrackDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AcademyTrackDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
