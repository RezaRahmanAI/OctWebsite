using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

public interface IAcademyService
{
    Task<IReadOnlyList<AcademyTrackDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AcademyTrackDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<AcademyTrackDto> CreateAsync(SaveAcademyTrackRequest request, CancellationToken cancellationToken = default);
    Task<AcademyTrackDto?> UpdateAsync(Guid id, SaveAcademyTrackRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record SaveAcademyTrackRequest(
    string Title,
    string Slug,
    string? AgeRange,
    string Duration,
    string PriceLabel,
    IReadOnlyList<AcademyTrackLevel> Levels,
    bool Active);
