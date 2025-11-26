using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IContactChannelsService
{
    Task<ContactChannelsDto> GetAsync(CancellationToken cancellationToken = default);
    Task<ContactChannelsDto> UpsertAsync(SaveContactChannelsRequest request, CancellationToken cancellationToken = default);
}
