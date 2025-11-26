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
}
