using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/methodology-page")]
public sealed class MethodologyController(IMethodologyPageService service, IWebHostEnvironment environment) : ControllerBase
{
    private const string MediaFolder = "uploads/methodology";

    [HttpGet]
    [ProducesResponseType(typeof(MethodologyPageDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MethodologyPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await service.GetAsync(cancellationToken);
        return Ok(ResolveMedia(page with { Offerings = page.Offerings.Where(offering => offering.Active).ToArray() }));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    [ProducesResponseType(typeof(MethodologyPageDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MethodologyPageDto>> UpsertAsync(
        [FromForm] SaveMethodologyPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, MediaFolder, form.HeroVideoFileName, cancellationToken);

        var heroHighlights = (form.HeroHighlights ?? Array.Empty<StatHighlightFormRequest>())
            .Select(highlight => new StatHighlightDto(highlight.Label ?? string.Empty, highlight.Value ?? string.Empty))
            .ToArray();

        var matrixColumns = (form.MatrixColumns ?? Array.Empty<MatrixColumnFormRequest>())
            .Select(column => new MatrixColumnDto(column.Key ?? string.Empty, column.Label ?? string.Empty))
            .ToArray();

        var featureMatrix = (form.FeatureMatrix ?? Array.Empty<MatrixFeatureFormRequest>())
            .Select(feature => new MatrixFeatureDto(
                feature.Name ?? string.Empty,
                feature.AppliesTo?.Where(value => !string.IsNullOrWhiteSpace(value)).ToArray() ?? Array.Empty<string>()))
            .ToArray();

        var contactFields = (form.ContactFields ?? Array.Empty<string>())
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .ToArray();

        var request = new SaveMethodologyPageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            form.HeroDescription ?? string.Empty,
            CreateMediaResource(heroVideoFileName),
            heroHighlights,
            matrixColumns,
            featureMatrix,
            contactFields);

        var page = await service.UpsertPageAsync(request, cancellationToken);
        return Ok(ResolveMedia(page));
    }

    private MethodologyPageDto ResolveMedia(MethodologyPageDto dto)
    {
        return dto with
        {
            HeroVideo = Resolve(dto.HeroVideo, MediaFolder)
        };
    }

    private static MediaResourceDto? CreateMediaResource(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }

    private MediaResourceDto? Resolve(MediaResourceDto? media, string folder)
    {
        if (media is null || string.IsNullOrWhiteSpace(media.FileName))
        {
            return media;
        }

        if (!string.IsNullOrWhiteSpace(media.Url))
        {
            return media;
        }

        var relativePath = BuildRelativePath(media.FileName, folder);
        var url = $"{Request.Scheme}://{Request.Host}/{relativePath}";
        return media with { Url = url };
    }

    private string BuildRelativePath(string fileName, string folder)
    {
        var normalized = fileName.Trim().Replace("\\", "/");
        if (normalized.Contains('/'))
        {
            var trimmed = normalized.TrimStart('/');
            if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
            {
                return trimmed;
            }

            return $"uploads/{trimmed}";
        }

        var normalizedFolder = folder.Trim('/').Replace("\\", "/");
        return $"{normalizedFolder}/{normalized}";
    }

    private async Task<string?> StoreMediaIfNeededAsync(
        IFormFile? file,
        string folder,
        string? existingFileName,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

        var uploadsRoot = EnsureUploadsFolder(folder);
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(fileExtension)
            ? $"{Guid.NewGuid():N}.bin"
            : $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return fileName;
    }

    private string EnsureUploadsFolder(string folder)
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(webRoot);
            environment.WebRootPath = webRoot;
        }

        var uploadsFolder = Path.Combine(webRoot, folder.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(uploadsFolder);
        return uploadsFolder;
    }
}

[ApiController]
[Route("api/methodology-offerings")]
public sealed class MethodologyOfferingsController(IMethodologyPageService service) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<MethodologyOfferingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MethodologyOfferingDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var offerings = await service.GetOfferingsAsync(cancellationToken);
        return Ok(offerings);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(MethodologyOfferingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MethodologyOfferingDto>> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken)
    {
        var offering = await service.GetBySlugAsync(slug, cancellationToken);
        return offering is null ? NotFound() : Ok(offering);
    }

    [HttpPost]
    [ProducesResponseType(typeof(MethodologyOfferingDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<MethodologyOfferingDto>> CreateAsync(
        [FromBody] SaveMethodologyOfferingRequest request,
        CancellationToken cancellationToken)
    {
        var created = await service.CreateOfferingAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, created);
    }

    [HttpPost("{id:guid}")]
    [ProducesResponseType(typeof(MethodologyOfferingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MethodologyOfferingDto>> UpdateAsync(
        Guid id,
        [FromBody] SaveMethodologyOfferingRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await service.UpdateOfferingAsync(id, request, cancellationToken);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        await service.DeleteOfferingAsync(id, cancellationToken);
        return NoContent();
    }
}

public sealed class SaveMethodologyPageFormRequest
{
    public string? HeaderEyebrow { get; set; }

    public string? HeaderTitle { get; set; }

    public string? HeaderSubtitle { get; set; }

    public string? HeroDescription { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }

    public IList<StatHighlightFormRequest> HeroHighlights { get; set; } = new List<StatHighlightFormRequest>();

    public IList<MatrixColumnFormRequest> MatrixColumns { get; set; } = new List<MatrixColumnFormRequest>();

    public IList<MatrixFeatureFormRequest> FeatureMatrix { get; set; } = new List<MatrixFeatureFormRequest>();

    public IList<string> ContactFields { get; set; } = new List<string>();
}

public sealed class StatHighlightFormRequest
{
    public string? Label { get; set; }

    public string? Value { get; set; }
}

public sealed class MatrixColumnFormRequest
{
    public string? Key { get; set; }

    public string? Label { get; set; }
}

public sealed class MatrixFeatureFormRequest
{
    public string? Name { get; set; }

    public IList<string> AppliesTo { get; set; } = new List<string>();
}
