using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/about-page")]
[Authorize]
public sealed class AboutPageController(IAboutPageService aboutPageService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<AboutPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await aboutPageService.GetAsync(cancellationToken);
        return Ok(ResolveMediaUrls(page));
    }

    [HttpPut]
    public async Task<ActionResult<AboutPageDto>> UpsertAsync([FromBody] SaveAboutPageRequest request, CancellationToken cancellationToken)
    {
        var updated = await aboutPageService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveMediaUrls(updated));
    }

    private AboutPageDto ResolveMediaUrls(AboutPageDto dto)
    {
        return dto with
        {
            HeroVideo = Resolve(dto.HeroVideo),
            MissionImage = Resolve(dto.MissionImage),
            StoryImage = Resolve(dto.StoryImage),
            Values = dto.Values
                .Select(value => value with { Video = Resolve(value.Video) })
                .ToArray()
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

        var normalized = media.FileName.TrimStart('/')
            .Replace("\\", "/");
        var url = $"{Request.Scheme}://{Request.Host}/uploads/{normalized}";
        return media with { Url = url };
    }
}
