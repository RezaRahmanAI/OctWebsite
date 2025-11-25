using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class TeamService(ITeamRepository repository) : ITeamService
{
    public async Task<IReadOnlyList<TeamMemberDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var members = await repository.GetAllAsync(cancellationToken);
        return members.Select(member => member.ToDto()).ToArray();
    }

    public async Task<TeamMemberDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var member = await repository.GetByIdAsync(id, cancellationToken);
        return member?.ToDto();
    }

    public async Task<TeamMemberDto> CreateAsync(SaveTeamMemberRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var member = new TeamMember(
            Guid.NewGuid(),
            request.Name.Trim(),
            request.Role.Trim(),
            request.PhotoFileName?.Trim(),
            request.Bio.Trim(),
            request.Email.Trim(),
            request.Active);

        var created = await repository.CreateAsync(member, cancellationToken);
        return created.ToDto();
    }

    public async Task<TeamMemberDto?> UpdateAsync(Guid id, SaveTeamMemberRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Name = request.Name.Trim(),
            Role = request.Role.Trim(),
            PhotoFileName = request.PhotoFileName?.Trim(),
            Bio = request.Bio.Trim(),
            Email = request.Email.Trim(),
            Active = request.Active
        };

        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveTeamMemberRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Name);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Role);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Bio);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Email);
    }
}
