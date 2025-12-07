using System.Text.Json.Serialization;

namespace OctWebsite.Application.DTOs;

public sealed record StatHighlightDto(string Label, string Value);

public sealed record MatrixColumnDto(string Key, string Label);

public sealed record MatrixFeatureDto(string Name, IReadOnlyList<string> AppliesTo);

public sealed record BenefitCardDto(string Title, string Description);

public sealed record ProcessStepDto(string Title, string Description);

public sealed record MethodologyClosingDto(string Title, IReadOnlyList<string> Bullets, string CtaLabel);

public sealed record MethodologyOfferingDto(
    Guid Id,
    string Slug,
    string Badge,
    string Headline,
    string Subheadline,
    IReadOnlyList<string> Intro,
    IReadOnlyList<StatHighlightDto> Stats,
    IReadOnlyList<BenefitCardDto> Benefits,
    IReadOnlyList<ProcessStepDto> Process,
    MethodologyClosingDto Closing,
    bool Active);

public sealed record SaveMethodologyOfferingRequest(
    string Slug,
    string Badge,
    string Headline,
    string Subheadline,
    IReadOnlyList<string> Intro,
    IReadOnlyList<StatHighlightDto> Stats,
    IReadOnlyList<BenefitCardDto> Benefits,
    IReadOnlyList<ProcessStepDto> Process,
    MethodologyClosingDto Closing,
    bool Active);

public sealed record SaveMethodologyPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string HeroDescription,
    MediaResourceDto? HeroVideo,
    IReadOnlyList<StatHighlightDto> HeroHighlights,
    IReadOnlyList<MatrixColumnDto> MatrixColumns,
    IReadOnlyList<MatrixFeatureDto> FeatureMatrix,
    IReadOnlyList<string> ContactFields);

public sealed record MethodologyPageDto(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string HeroDescription,
    MediaResourceDto? HeroVideo,
    IReadOnlyList<StatHighlightDto> HeroHighlights,
    IReadOnlyList<MatrixColumnDto> MatrixColumns,
    IReadOnlyList<MatrixFeatureDto> FeatureMatrix,
    IReadOnlyList<string> ContactFields,
    IReadOnlyList<MethodologyOfferingDto> Offerings);

public sealed record MethodologyPageStorage(
    SaveMethodologyPageRequest Page,
    IReadOnlyList<MethodologyOfferingDto> Offerings)
{
    [JsonIgnore]
    public static MethodologyPageStorage Empty => new(
        new SaveMethodologyPageRequest(
            string.Empty,
            string.Empty,
            string.Empty,
            string.Empty,
            new MediaResourceDto(null, null),
            Array.Empty<StatHighlightDto>(),
            Array.Empty<MatrixColumnDto>(),
            Array.Empty<MatrixFeatureDto>(),
            Array.Empty<string>()),
        Array.Empty<MethodologyOfferingDto>());
}
