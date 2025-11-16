using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;
using OctWebsite.Domain.Entities;
using Xunit;

namespace OctWebsite.Application.Tests;

public class ServiceCatalogTests
{
    [Fact]
    public async Task GetUnifiedCatalogAsync_ReturnsSoftwareSolutionsAndTrainingPrograms()
    {
        // Arrange
        var services = new ServiceCollection();
        services.AddSingleton<IServiceRepository>(new FakeServiceRepository());
        services.AddSingleton<IProductRepository>(new FakeProductRepository());
        services.AddSingleton<IAcademyRepository>(new FakeAcademyRepository());
        services.AddApplication();

        await using var provider = services.BuildServiceProvider();
        var catalog = provider.GetRequiredService<IServiceCatalog>();

        // Act
        var result = await catalog.GetUnifiedCatalogAsync();

        // Assert
        result.SoftwareSolutions.Should().HaveCount(3);
        result.SoftwareSolutions.Select(solution => solution.Type).Should().Contain(new[]
        {
            ServiceOfferingType.Service,
            ServiceOfferingType.Product
        });

        result.TrainingPrograms.Should().HaveCount(2);
        result.SoftwareSolutions.Select(solution => solution.Title)
            .Should().ContainInOrder("Custom Engineering", "Retail Platform", "Sales CRM");
    }

    private sealed class FakeServiceRepository : IServiceRepository
    {
        private readonly List<ServiceItem> items =
        [
            new ServiceItem(
                Guid.NewGuid(),
                "Custom Engineering",
                "custom-engineering",
                "Delivery squads for complex platforms.",
                "code",
                ["Discovery", "Delivery"],
                true)
        ];

        public Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyList<ServiceItem>>(items);

        public Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
            => Task.FromResult(items.FirstOrDefault(service => service.Slug == slug));

        public Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(items.FirstOrDefault(service => service.Id == id));

        public Task<ServiceItem> CreateAsync(ServiceItem service, CancellationToken cancellationToken = default)
        {
            items.Add(service);
            return Task.FromResult(service);
        }

        public Task<ServiceItem?> UpdateAsync(ServiceItem service, CancellationToken cancellationToken = default)
        {
            var index = items.FindIndex(existing => existing.Id == service.Id);
            if (index < 0)
            {
                return Task.FromResult<ServiceItem?>(null);
            }

            items[index] = service;
            return Task.FromResult<ServiceItem?>(service);
        }

        public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var removed = items.RemoveAll(service => service.Id == id) > 0;
            return Task.FromResult(removed);
        }
    }

    private sealed class FakeProductRepository : IProductRepository
    {
        private readonly List<ProductItem> items =
        [
            new ProductItem(
                Guid.NewGuid(),
                "Retail Platform",
                "retail-platform",
                "Unified commerce stack.",
                "store",
                ["POS", "Inventory"],
                true),
            new ProductItem(
                Guid.NewGuid(),
                "Sales CRM",
                "sales-crm",
                "Automation-ready CRM.",
                "users",
                ["Leads", "Reporting"],
                true)
        ];

        public Task<IReadOnlyList<ProductItem>> GetAllAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyList<ProductItem>>(items);

        public Task<ProductItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
            => Task.FromResult(items.FirstOrDefault(product => product.Slug == slug));

        public Task<ProductItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(items.FirstOrDefault(product => product.Id == id));

        public Task<ProductItem> CreateAsync(ProductItem product, CancellationToken cancellationToken = default)
        {
            items.Add(product);
            return Task.FromResult(product);
        }

        public Task<ProductItem?> UpdateAsync(ProductItem product, CancellationToken cancellationToken = default)
        {
            var index = items.FindIndex(existing => existing.Id == product.Id);
            if (index < 0)
            {
                return Task.FromResult<ProductItem?>(null);
            }

            items[index] = product;
            return Task.FromResult<ProductItem?>(product);
        }

        public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var removed = items.RemoveAll(product => product.Id == id) > 0;
            return Task.FromResult(removed);
        }
    }

    private sealed class FakeAcademyRepository : IAcademyRepository
    {
        private readonly List<AcademyTrack> items =
        [
            new AcademyTrack(
                Guid.NewGuid(),
                "Foundations",
                "foundations",
                "Age 16+",
                "10 weeks",
                "$999",
                [new AcademyTrackLevel("Start", ["Tool"], ["Outcome"])],
                true),
            new AcademyTrack(
                Guid.NewGuid(),
                "Launch",
                "launch",
                "Age 18+",
                "12 weeks",
                "$1299",
                [new AcademyTrackLevel("Build", ["Tool"], ["Outcome"])],
                true)
        ];

        public Task<IReadOnlyList<AcademyTrack>> GetAllAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyList<AcademyTrack>>(items);

        public Task<AcademyTrack?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
            => Task.FromResult(items.FirstOrDefault(track => track.Slug == slug));

        public Task<AcademyTrack?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(items.FirstOrDefault(track => track.Id == id));

        public Task<AcademyTrack> CreateAsync(AcademyTrack track, CancellationToken cancellationToken = default)
        {
            items.Add(track);
            return Task.FromResult(track);
        }

        public Task<AcademyTrack?> UpdateAsync(AcademyTrack track, CancellationToken cancellationToken = default)
        {
            var index = items.FindIndex(existing => existing.Id == track.Id);
            if (index < 0)
            {
                return Task.FromResult<AcademyTrack?>(null);
            }

            items[index] = track;
            return Task.FromResult<AcademyTrack?>(track);
        }

        public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var removed = items.RemoveAll(track => track.Id == id) > 0;
            return Task.FromResult(removed);
        }
    }
}
