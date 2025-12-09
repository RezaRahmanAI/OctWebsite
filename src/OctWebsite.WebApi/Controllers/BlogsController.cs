using System;
using System.Linq;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/blogs")]
[Authorize]
public sealed class BlogsController(IBlogService blogService, IWebHostEnvironment environment) : ControllerBase
{
    private const string MediaFolder = "uploads/blog";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<BlogPostDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var posts = await blogService.GetAllAsync(cancellationToken);
        return Ok(posts.Select(ResolveMedia));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<BlogPostDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var post = await blogService.GetByIdAsync(id, cancellationToken);
        return post is null ? NotFound() : Ok(ResolveMedia(post));
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<BlogPostDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var post = await blogService.GetBySlugAsync(slug, cancellationToken);
        return post is null ? NotFound() : Ok(ResolveMedia(post));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<BlogPostDto>> CreateAsync([FromForm] SaveBlogPostFormRequest form, CancellationToken cancellationToken)
    {
        var request = await MapAsync(form, null, cancellationToken);
        var created = await blogService.CreateAsync(request, cancellationToken);
        var hydrated = ResolveMedia(created);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, hydrated);
    }

    [HttpPost("{id:guid}")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<BlogPostDto>> UpdateAsync(Guid id, [FromForm] SaveBlogPostFormRequest form, CancellationToken cancellationToken)
    {
        var existing = await blogService.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        var request = await MapAsync(form, existing, cancellationToken);
        var updated = await blogService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(ResolveMedia(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await blogService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private async Task<SaveBlogPostRequest> MapAsync(
        SaveBlogPostFormRequest form,
        BlogPostDto? existing,
        CancellationToken cancellationToken)
    {
        var thumbnailFileName = await StoreMediaIfNeededAsync(
            form.Thumbnail,
            form.ThumbnailFileName ?? existing?.ThumbnailFileName,
            cancellationToken);

        var headerVideoFileName = await StoreMediaIfNeededAsync(
            form.HeaderVideo,
            form.HeaderVideoFileName ?? existing?.HeaderVideo?.FileName,
            cancellationToken);

        var stats = form.Stats?.Select(stat => new SaveBlogStatRequest(stat.Label ?? string.Empty, stat.Value ?? string.Empty)).ToArray()
            ?? existing?.Stats.Select(stat => new SaveBlogStatRequest(stat.Label, stat.Value)).ToArray()
            ?? Array.Empty<SaveBlogStatRequest>();

        return new SaveBlogPostRequest(
            form.Title ?? existing?.Title ?? string.Empty,
            form.Slug ?? existing?.Slug ?? string.Empty,
            form.Excerpt ?? existing?.Excerpt ?? string.Empty,
            form.Content ?? existing?.Content ?? string.Empty,
            thumbnailFileName,
            headerVideoFileName,
            form.Tags?.ToArray() ?? existing?.Tags ?? Array.Empty<string>(),
            form.Published ?? existing?.Published ?? false,
            form.PublishedAt ?? existing?.PublishedAt,
            form.Author ?? existing?.Author,
            form.AuthorTitle ?? existing?.AuthorTitle,
            form.ReadTime ?? existing?.ReadTime,
            form.HeroQuote ?? existing?.HeroQuote,
            form.KeyPoints?.ToArray() ?? existing?.KeyPoints ?? Array.Empty<string>(),
            stats);
    }

    private BlogPostDto ResolveMedia(BlogPostDto dto)
    {
        var thumbnailUrl = ResolveFileUrl(dto.ThumbnailFileName);
        var headerVideo = Resolve(dto.HeaderVideo);

        return dto with
        {
            ThumbnailUrl = thumbnailUrl,
            HeaderVideo = headerVideo
        };
    }

    private MediaResourceDto? Resolve(MediaResourceDto? media)
    {
        if (media is null || string.IsNullOrWhiteSpace(media.FileName))
        {
            return media;
        }

        if (!string.IsNullOrWhiteSpace(media.Url))
        {
            return media;
        }

        var url = ResolveFileUrl(media.FileName);
        return media with { Url = url };
    }

    private string? ResolveFileUrl(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        var normalized = fileName.Trim();
        if (normalized.Contains("://"))
        {
            return normalized;
        }

        if (normalized.StartsWith("/"))
        {
            normalized = normalized.TrimStart('/');
        }

        var relative = $"{MediaFolder.Trim('/')}/{normalized}";
        return $"{Request.Scheme}://{Request.Host}/{relative}";
    }

    private async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string? existingFileName, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

        var uploadsRoot = EnsureUploadsFolder();
        var extension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(extension) ? $"{Guid.NewGuid():N}.bin" : $"{Guid.NewGuid()}{extension}";
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

        var uploads = Path.Combine(webRoot, MediaFolder.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(uploads);
        return uploads;
    }
}

public sealed class SaveBlogStatFormRequest
{
    public string? Label { get; set; }

    public string? Value { get; set; }
}

public sealed class SaveBlogPostFormRequest
{
    public string? Title { get; set; }

    public string? Slug { get; set; }

    public string? Excerpt { get; set; }

    public string? Content { get; set; }

    public string? ThumbnailFileName { get; set; }

    public IFormFile? Thumbnail { get; set; }

    public string? HeaderVideoFileName { get; set; }

    public IFormFile? HeaderVideo { get; set; }

    public IList<string>? Tags { get; set; }

    public bool? Published { get; set; }

    public DateTimeOffset? PublishedAt { get; set; }

    public string? Author { get; set; }

    public string? AuthorTitle { get; set; }

    public string? ReadTime { get; set; }

    public string? HeroQuote { get; set; }

    public IList<string>? KeyPoints { get; set; }

    public IList<SaveBlogStatFormRequest>? Stats { get; set; }
}
