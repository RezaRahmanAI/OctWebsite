using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/home-testimonials")]
[Authorize]
public sealed class HomeTestimonialsController(IHomeTestimonialService testimonialService, IWebHostEnvironment environment)
    : HomeMediaControllerBase(environment)
{
    private const string TestimonialFolder = "uploads/home/testimonials";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<HomeTestimonialDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var testimonials = await testimonialService.GetAsync(cancellationToken);
        return Ok(testimonials.Select(ResolveTestimonial).ToArray());
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<HomeTestimonialDto>> CreateAsync([FromForm] HomeTestimonialFormRequest form, CancellationToken cancellationToken)
    {
        var request = await ToRequestAsync(form, cancellationToken);
        var created = await testimonialService.CreateAsync(request, cancellationToken);
        return Ok(ResolveTestimonial(created));
    }

    [HttpPut("{id:guid}")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<HomeTestimonialDto>> UpdateAsync(Guid id, [FromForm] HomeTestimonialFormRequest form, CancellationToken cancellationToken)
    {
        var request = await ToRequestAsync(form, cancellationToken);
        var updated = await testimonialService.UpdateAsync(id, request, cancellationToken);
        return Ok(ResolveTestimonial(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        await testimonialService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    private HomeTestimonialDto ResolveTestimonial(HomeTestimonialDto dto)
        => dto with { Image = Resolve(dto.Image, TestimonialFolder) };

    private async Task<HomeTestimonialRequest> ToRequestAsync(HomeTestimonialFormRequest form, CancellationToken cancellationToken)
    {
        var imageFile = await StoreMediaIfNeededAsync(form.Image, TestimonialFolder, form.ImageFileName, cancellationToken);
        return new HomeTestimonialRequest(
            form.Quote ?? string.Empty,
            form.Name ?? string.Empty,
            form.Title ?? string.Empty,
            form.Location ?? string.Empty,
            form.Rating,
            form.Type ?? string.Empty,
            imageFile);
    }
}
