using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IAcademyRepository
{
    Task<IReadOnlyList<AcademyTrack>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AcademyTrack?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
