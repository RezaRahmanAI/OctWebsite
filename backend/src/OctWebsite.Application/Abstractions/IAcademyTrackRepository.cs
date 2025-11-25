using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IAcademyTrackRepository
{
    Task<IReadOnlyList<AcademyTrack>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AcademyTrack?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<AcademyTrack?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<AcademyTrack> CreateAsync(AcademyTrack track, CancellationToken cancellationToken = default);
    Task<AcademyTrack?> UpdateAsync(AcademyTrack track, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
