using System.Threading;
using System.Threading.Tasks;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ICareerPageRepository
{
    Task<CareerPage?> GetAsync(CancellationToken cancellationToken = default);

    Task<CareerPage> UpsertAsync(CareerPage page, CancellationToken cancellationToken = default);
}
