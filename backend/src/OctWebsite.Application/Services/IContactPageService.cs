using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IContactPageService
{
    Task<ContactPageDto> GetAsync(CancellationToken cancellationToken = default);
    Task<ContactPageDto> UpsertAsync(SaveContactPageRequest request, CancellationToken cancellationToken = default);
}
