using System.Linq;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.DTOs;

public static class MappingExtensions
{
    public static TeamMemberDto ToDto(this TeamMember member) => new(
        member.Id,
        member.Name,
        member.Role,
        member.PhotoFileName,
        null,
        member.Bio,
        member.Email,
        member.Active);

    public static CompanyAboutDto ToDto(this CompanyAbout about) => new(
        about.Id,
        about.Key,
        about.Content);

    public static ContactSubmissionDto ToDto(this ContactSubmission submission) => new(
        submission.Id,
        submission.Name,
        submission.Email,
        submission.Phone,
        submission.Interest,
        submission.Message,
        submission.CreatedAt);

    public static ServiceDto ToDto(this ServiceItem service) => new(
        service.Id,
        service.Title,
        service.Subtitle,
        service.Slug,
        service.Summary,
        service.Description,
        service.Icon,
        CreateMedia(service.BackgroundImageFileName),
        service.Features,
        service.Active,
        service.Featured);

    private static ServiceMediaDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new ServiceMediaDto(fileName, null);
    }

    public static ProductDto ToDto(this ProductItem product) => new(
        product.Id,
        product.Title,
        product.Slug,
        product.Summary,
        product.Icon,
        product.Features,
        product.Active);

    public static JobPostingDto ToDto(this JobPosting posting) => new(
        posting.Id,
        posting.Title,
        posting.Location,
        posting.EmploymentType,
        posting.Summary,
        posting.DetailsUrl,
        posting.Active,
        posting.PublishedAt);

    public static CareerApplicationDto ToDto(this CareerApplication application, string jobTitle) => new(
        application.Id,
        application.JobPostingId,
        jobTitle,
        application.FullName,
        application.Email,
        application.Phone,
        application.Message,
        application.CvFileName,
        null,
        application.CreatedAt);
}
