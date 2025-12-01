using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.Services;
using OctWebsite.Application.DTOs;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/team")]
[Authorize]
public sealed class TeamController(ITeamService teamService, IWebHostEnvironment environment) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<TeamMemberDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var members = await teamService.GetAllAsync(cancellationToken);
        return Ok(members.Select(ResolveMediaUrl));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<TeamMemberDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var member = await teamService.GetByIdAsync(id, cancellationToken);
        return member is null ? NotFound() : Ok(ResolveMediaUrl(member));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<TeamMemberDto>> CreateAsync([
        FromForm] SaveTeamMemberRequest request,
        IFormFile? photo,
        CancellationToken cancellationToken)
    {
        var photoFileName = await StoreMediaIfNeededAsync(photo, request.PhotoFileName, cancellationToken);
        if (string.IsNullOrWhiteSpace(photoFileName))
        {
            return BadRequest("A profile photo is required for each team member.");
        }

        var created = await teamService.CreateAsync(request with { PhotoFileName = photoFileName }, cancellationToken);
        var hydrated = ResolveMediaUrl(created);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, hydrated);
    }

    [HttpPut("{id:guid}")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<TeamMemberDto>> UpdateAsync(
        Guid id,
        [FromForm] SaveTeamMemberRequest request,
        IFormFile? photo,
        CancellationToken cancellationToken)
    {
        var existing = await teamService.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        var photoFileName = await StoreMediaIfNeededAsync(photo, request.PhotoFileName ?? existing.PhotoFileName, cancellationToken);
        if (string.IsNullOrWhiteSpace(photoFileName))
        {
            photoFileName = existing.PhotoFileName;
        }

        var updated = await teamService.UpdateAsync(id, request with { PhotoFileName = photoFileName }, cancellationToken);
        return updated is null ? NotFound() : Ok(ResolveMediaUrl(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await teamService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private TeamMemberDto ResolveMediaUrl(TeamMemberDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.PhotoUrl))
        {
            return dto;
        }

        if (string.IsNullOrWhiteSpace(dto.PhotoFileName))
        {
            return dto;
        }

        var normalized = dto.PhotoFileName.TrimStart('/').Replace("\\", "/");
        var url = $"{Request.Scheme}://{Request.Host}/uploads/{normalized}";
        return dto with { PhotoUrl = url };
    }

    private async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string? existingFileName, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

        var uploadsRoot = EnsureUploadsRoot();
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(fileExtension)
            ? $"{Guid.NewGuid():N}.bin"
            : $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return fileName;
    }

    private string EnsureUploadsRoot()
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(webRoot);
            environment.WebRootPath = webRoot;
        }

        var uploadsRoot = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsRoot);
        return uploadsRoot;
    }
}
