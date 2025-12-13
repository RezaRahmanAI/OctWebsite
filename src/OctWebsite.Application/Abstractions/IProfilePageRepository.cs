using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IProfilePageRepository
{
    Task<ProfilePage?> GetAsync(CancellationToken cancellationToken = default);

    Task<ProfilePage> UpsertAsync(ProfilePage page, CancellationToken cancellationToken = default);
}
