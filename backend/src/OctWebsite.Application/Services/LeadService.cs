using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Exceptions;
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
        var errors = new Dictionary<string, List<string>>();

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            AddError(errors, nameof(request.Name), "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email) || !EmailRegex().IsMatch(request.Email))
        {
            AddError(errors, nameof(request.Email), "A valid email address is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            AddError(errors, nameof(request.Message), "Message is required.");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException(
                "One or more validation errors occurred.",
                errors.ToDictionary(pair => pair.Key, pair => pair.Value.ToArray()));
        }
    }

    [GeneratedRegex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")] private static partial Regex EmailRegex();

    private static void AddError(IDictionary<string, List<string>> errors, string key, string message)
    {
        if (!errors.TryGetValue(key, out var list))
        {
            list = new List<string>();
            errors[key] = list;
        }

        list.Add(message);
    }
}
