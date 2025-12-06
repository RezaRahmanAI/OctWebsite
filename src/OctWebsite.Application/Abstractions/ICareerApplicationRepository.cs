using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ICareerApplicationRepository
{
    Task<CareerApplication> CreateAsync(CareerApplication application, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CareerApplication>> GetRecentAsync(int take, CancellationToken cancellationToken = default);
}
