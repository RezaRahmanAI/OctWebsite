using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class CareerService(
    IJobPostingRepository jobPostings,
    ICareerApplicationRepository applications) : ICareerService
{
    public async Task<IReadOnlyList<JobPostingDto>> GetOpenAsync(CancellationToken cancellationToken = default)
    {
        var openings = await jobPostings.GetOpenAsync(cancellationToken);
        return openings.Select(posting => posting.ToDto()).ToArray();
    }

    public async Task<IReadOnlyList<JobPostingDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var postings = await jobPostings.GetAllAsync(cancellationToken);
        return postings.Select(posting => posting.ToDto()).ToArray();
    }

    public async Task<JobPostingDto> CreatePostingAsync(SaveJobPostingRequest request, CancellationToken cancellationToken = default)
    {
        ValidatePosting(request);

        var posting = new JobPosting(
            Guid.NewGuid(),
            request.Title.Trim(),
            request.Location.Trim(),
            request.EmploymentType.Trim(),
            request.Description.Trim(),
            request.Summary.Trim(),
            request.Active,
            DateTimeOffset.UtcNow);

        var saved = await jobPostings.CreateAsync(posting, cancellationToken);
        return saved.ToDto();
    }

    public async Task<JobPostingDto?> UpdatePostingAsync(Guid id, SaveJobPostingRequest request, CancellationToken cancellationToken = default)
    {
        ValidatePosting(request);
        var existing = await jobPostings.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Title = request.Title.Trim(),
            Location = request.Location.Trim(),
            EmploymentType = request.EmploymentType.Trim(),
            Description = request.Description.Trim(),
            Summary = request.Summary.Trim(),
            Active = request.Active
        };

        var saved = await jobPostings.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeletePostingAsync(Guid id, CancellationToken cancellationToken = default)
        => jobPostings.DeleteAsync(id, cancellationToken);

    public async Task<CareerApplicationDto> SubmitApplicationAsync(SubmitCareerApplicationRequest request, CancellationToken cancellationToken = default)
    {
        ValidateApplication(request);
        var job = await jobPostings.GetByIdAsync(request.JobPostingId, cancellationToken);
        if (job is null)
        {
            throw new InvalidOperationException("The selected job posting could not be found.");
        }

        var application = new CareerApplication(
            Guid.NewGuid(),
            request.JobPostingId,
            request.FullName.Trim(),
            request.Email.Trim(),
            string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            string.IsNullOrWhiteSpace(request.Message) ? null : request.Message.Trim(),
            string.IsNullOrWhiteSpace(request.CvFileName) ? null : request.CvFileName.Trim(),
            DateTimeOffset.UtcNow);

        var saved = await applications.CreateAsync(application, cancellationToken);
        return saved.ToDto(job.Title);
    }

    public async Task<IReadOnlyList<CareerApplicationDto>> GetRecentApplicationsAsync(int take = 200, CancellationToken cancellationToken = default)
    {
        var capped = Math.Clamp(take, 1, 500);
        var entries = await applications.GetRecentAsync(capped, cancellationToken);
        return entries.Select(application =>
        {
            var title = application.JobPosting?.Title ?? "Unknown role";
            return application.ToDto(title);
        }).ToArray();
    }

    private static void ValidatePosting(SaveJobPostingRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Location);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.EmploymentType);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Description);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
    }

    private static void ValidateApplication(SubmitCareerApplicationRequest request)
    {
        if (request.JobPostingId == Guid.Empty)
        {
            throw new ArgumentException("Job posting is required.", nameof(request.JobPostingId));
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(request.FullName);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Email);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.CvFileName);
    }
}
