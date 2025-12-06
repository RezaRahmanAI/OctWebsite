using System.Threading;
using System.Threading.Tasks;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface ICareerPageService
{
    Task<CareerPageDto> GetAsync(CancellationToken cancellationToken = default);

    Task<CareerPageDto> UpsertAsync(SaveCareerPageRequest request, CancellationToken cancellationToken = default);
}
