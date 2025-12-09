using System;
using System.IO;
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

        var url = BuildAbsoluteUrl(media.FileName, folder);
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

    protected string BuildAbsoluteUrl(string fileName, string folder)
    {
        var relativePath = BuildRelativePath(fileName, folder);
        if (Uri.TryCreate(relativePath, UriKind.Absolute, out _))
        {
            return relativePath;
        }

        return $"{Request.Scheme}://{Request.Host}/{relativePath}";
    }

    protected string BuildRelativePath(string fileName, string folder)
    {
        var normalized = fileName.Trim().Replace("\\", "/");
        if (Uri.TryCreate(normalized, UriKind.Absolute, out _))
        {
            return normalized;
        }

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
