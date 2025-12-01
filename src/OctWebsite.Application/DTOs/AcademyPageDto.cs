namespace OctWebsite.Application.DTOs;

public sealed record AcademyFeatureDto(
    string Title,
    string Description,
    string Icon);

public sealed record FreelancingCourseDto(
    string Title,
    string Description,
    string Icon);

public sealed record AcademyTrackLevelDto(
    string Title,
    string Duration,
    string Description,
    IReadOnlyList<string> Tools,
    IReadOnlyList<string> Outcomes,
    string Project,
    string Image);

public sealed record AdmissionStepDto(
    string Title,
    string Description);

public sealed record AcademyTrackDto(
    Guid Id,
    string Title,
    string Slug,
    string AgeRange,
    string Duration,
    string PriceLabel,
    string Audience,
    string Format,
    string Summary,
    MediaResourceDto? HeroVideo,
    MediaResourceDto? HeroPoster,
    IReadOnlyList<string> Highlights,
    IReadOnlyList<string> LearningOutcomes,
    IReadOnlyList<AcademyTrackLevelDto> Levels,
    IReadOnlyList<AdmissionStepDto> AdmissionSteps,
    string CallToActionLabel,
    bool Active);

public sealed record SaveAcademyTrackLevelRequest(
    string Title,
    string Duration,
    string Description,
    IReadOnlyList<string> Tools,
    IReadOnlyList<string> Outcomes,
    string Project,
    string Image);

public sealed record SaveAdmissionStepRequest(
    string Title,
    string Description);

public sealed record SaveAcademyTrackRequest(
    string Title,
    string Slug,
    string AgeRange,
    string Duration,
    string PriceLabel,
    string Audience,
    string Format,
    string Summary,
    string? HeroVideoFileName,
    string? HeroPosterFileName,
    IReadOnlyList<string> Highlights,
    IReadOnlyList<string> LearningOutcomes,
    IReadOnlyList<SaveAcademyTrackLevelRequest> Levels,
    IReadOnlyList<SaveAdmissionStepRequest> AdmissionSteps,
    string CallToActionLabel,
    bool Active);

public sealed record AcademyPageDto(
    Guid Id,
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string Intro,
    MediaResourceDto? HeroVideo,
    IReadOnlyList<AcademyFeatureDto> KidsFeatures,
    IReadOnlyList<FreelancingCourseDto> FreelancingCourses,
    IReadOnlyList<AcademyTrackDto> Tracks);

public sealed record SaveAcademyPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string Intro,
    string? HeroVideoFileName,
    IReadOnlyList<AcademyFeatureDto> KidsFeatures,
    IReadOnlyList<FreelancingCourseDto> FreelancingCourses);
