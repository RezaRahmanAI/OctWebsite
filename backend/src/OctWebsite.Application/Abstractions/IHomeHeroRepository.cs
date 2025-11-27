using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IHomeHeroRepository
{
    Task<HomeHeroSection?> GetAsync(CancellationToken cancellationToken = default);
    Task<HomeHeroSection> CreateAsync(HomeHeroSection hero, CancellationToken cancellationToken = default);
    Task<HomeHeroSection?> UpdateAsync(HomeHeroSection hero, CancellationToken cancellationToken = default);
}
