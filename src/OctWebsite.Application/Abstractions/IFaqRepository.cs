using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IFaqRepository
{
    Task<IReadOnlyList<Faq>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Faq?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Faq> CreateAsync(Faq faq, CancellationToken cancellationToken = default);
    Task<Faq?> UpdateAsync(Faq faq, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
