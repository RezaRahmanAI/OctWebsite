using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/contact-channels")]
[Authorize]
public sealed class ContactChannelsController(IContactChannelsService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ContactChannelsDto>> GetAsync(CancellationToken cancellationToken)
    {
        var channels = await service.GetAsync(cancellationToken);
        return Ok(channels);
    }

    [HttpPost]
    public async Task<ActionResult<ContactChannelsDto>> UpsertAsync(
        [FromBody] SaveContactChannelsRequest request,
        CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return BadRequest("Request body is required.");
        }

        var localWhatsapp = request.LocalWhatsapp ?? new WhatsappChannelDto(string.Empty, string.Empty, string.Empty);
        var internationalWhatsapp = request.InternationalWhatsapp ?? new WhatsappChannelDto(string.Empty, string.Empty, string.Empty);

        var sanitized = request with
        {
            SocialLinks = (request.SocialLinks ?? Array.Empty<SocialLinkDto>())
                .Where(link => !string.IsNullOrWhiteSpace(link.Label) && !string.IsNullOrWhiteSpace(link.Url))
                .Select(link => new SocialLinkDto(link.Label.Trim(), link.Url.Trim()))
                .ToArray(),
            LocalPhoneNumber = request.LocalPhoneNumber.Trim(),
            InternationalPhoneNumber = request.InternationalPhoneNumber.Trim(),
            LocalWhatsapp = new WhatsappChannelDto(
                localWhatsapp.Label?.Trim() ?? string.Empty,
                localWhatsapp.Number.Trim(),
                localWhatsapp.Url.Trim()),
            InternationalWhatsapp = new WhatsappChannelDto(
                internationalWhatsapp.Label?.Trim() ?? string.Empty,
                internationalWhatsapp.Number.Trim(),
                internationalWhatsapp.Url.Trim()),
            BusinessEmail = request.BusinessEmail.Trim(),
            SupportEmail = request.SupportEmail.Trim()
        };

        var updated = await service.UpsertAsync(sanitized, cancellationToken);
        return Ok(updated);
    }
}
