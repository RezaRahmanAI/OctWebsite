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
    IReadOnlyList<StatHighlightDto> HeroHighlights,
    IReadOnlyList<MatrixColumnDto> MatrixColumns,
    IReadOnlyList<MatrixFeatureDto> FeatureMatrix,
    IReadOnlyList<string> ContactFields);

public sealed record MethodologyPageDto(
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
        new SaveMethodologyPageRequest(Array.Empty<StatHighlightDto>(), Array.Empty<MatrixColumnDto>(), Array.Empty<MatrixFeatureDto>(), Array.Empty<string>()),
        Array.Empty<MethodologyOfferingDto>());
}
