using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;

namespace OctWebsite.WebApi.Controllers;

public abstract class HomeMediaControllerBase : ControllerBase
{
    private readonly IWebHostEnvironment environment;

    protected HomeMediaControllerBase(IWebHostEnvironment environment)
    {
        this.environment = environment;
    }

    protected MediaResourceDto? Resolve(MediaResourceDto? media, string folder)
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

    protected async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string folder, string? existing, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existing;
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
