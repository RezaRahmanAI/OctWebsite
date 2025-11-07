namespace OctWebsite.Application.DTOs;

public sealed record ServiceCatalogDto(
    IReadOnlyList<ServiceOfferingDto> SoftwareSolutions,
    IReadOnlyList<AcademyTrackDto> TrainingPrograms
);
