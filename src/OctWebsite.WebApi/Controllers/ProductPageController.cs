using System;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/products-page")]
[Authorize]
public sealed class ProductPageController(IProductPageService productPageService, IWebHostEnvironment environment)
    : ControllerBase
{
    private const string UploadFolder = "uploads/product";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ProductPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await productPageService.GetAsync(cancellationToken);
        return Ok(Resolve(page));
    }

    [HttpPut]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ProductPageDto>> UpsertAsync(
        [FromForm] SaveProductPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, form.HeroVideoFileName, cancellationToken);

        var request = new SaveProductPageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            heroVideoFileName);

        var updated = await productPageService.UpsertAsync(request, cancellationToken);
        return Ok(Resolve(updated));
    }

    private ProductPageDto Resolve(ProductPageDto dto)
    {
        if (dto.HeroVideo is null || string.IsNullOrWhiteSpace(dto.HeroVideo.FileName))
        {
            return dto;
        }

        if (!string.IsNullOrWhiteSpace(dto.HeroVideo.Url))
        {
            return dto;
        }

        var relativePath = BuildRelativePath(dto.HeroVideo.FileName);
        var url = $"{Request.Scheme}://{Request.Host}/{relativePath}";
        return dto with { HeroVideo = dto.HeroVideo with { Url = url } };
    }

    private string BuildRelativePath(string fileName)
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

        var normalizedFolder = UploadFolder.Trim('/').Replace("\\", "/");
        return $"{normalizedFolder}/{normalized}";
    }

    private async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string? existingFileName, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

        var uploadsRoot = EnsureUploadsFolder();
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(fileExtension)
            ? $"{Guid.NewGuid():N}.bin"
            : $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return fileName;
    }

    private string EnsureUploadsFolder()
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(webRoot);
            environment.WebRootPath = webRoot;
        }

        var uploadsFolder = Path.Combine(webRoot, UploadFolder.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(uploadsFolder);
        return uploadsFolder;
    }
}

public sealed class SaveProductPageFormRequest
{
    public string? HeaderEyebrow { get; set; }

    public string? HeaderTitle { get; set; }

    public string? HeaderSubtitle { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }
}
