using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;
namespace OctWebsite.Application.Services;

internal sealed class ContactSubmissionService(IContactSubmissionRepository repository) : IContactSubmissionService
{
    public async Task<bool> SubmitAsync(SubmitContactFormRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var submission = new ContactSubmission(
            Guid.NewGuid(),
            request.Name.Trim(),
            request.Email.Trim(),
            string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            string.IsNullOrWhiteSpace(request.Interest) ? null : request.Interest.Trim(),
            request.Message.Trim(),
            DateTimeOffset.UtcNow);

        await repository.CreateAsync(submission, cancellationToken);
        return true;
    }

    public async Task<IReadOnlyList<ContactSubmissionDto>> GetRecentAsync(int take = 200, CancellationToken cancellationToken = default)
    {
        var capped = Math.Clamp(take, 1, 500);
        var submissions = await repository.GetRecentAsync(capped, cancellationToken);
        return submissions.Select(submission => submission.ToDto()).ToArray();
    }
}
