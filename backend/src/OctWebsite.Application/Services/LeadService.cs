using System;
using System.Linq;
using System.Text.RegularExpressions;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed partial class LeadService(ILeadRepository repository) : ILeadService
{
    public async Task<IReadOnlyList<LeadDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var leads = await repository.GetAllAsync(cancellationToken);
        return leads.OrderByDescending(lead => lead.CreatedAt).Select(lead => lead.ToDto()).ToArray();
    }

    public async Task<LeadDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var lead = await repository.GetByIdAsync(id, cancellationToken);
        return lead?.ToDto();
    }

    public async Task<LeadDto> CreateAsync(CreateLeadRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var lead = new Lead(
            Guid.NewGuid(),
            request.Name.Trim(),
            request.Email.Trim(),
            string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            string.IsNullOrWhiteSpace(request.Subject) ? null : request.Subject.Trim(),
            request.Message.Trim(),
            DateTimeOffset.UtcNow);

        var created = await repository.CreateAsync(lead, cancellationToken);
        return created.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default) => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(CreateLeadRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Name is required", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Email) || !EmailRegex().IsMatch(request.Email))
        {
            throw new ArgumentException("A valid email is required", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            throw new ArgumentException("Message is required", nameof(request));
        }
    }

    [GeneratedRegex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")] private static partial Regex EmailRegex();
}
