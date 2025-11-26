using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IContactPageRepository
{
    Task<ContactPage?> GetAsync(CancellationToken cancellationToken = default);

    Task<ContactPage> UpsertAsync(ContactPage page, CancellationToken cancellationToken = default);
}
