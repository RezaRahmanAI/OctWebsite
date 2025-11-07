using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;
using OctWebsite.Domain.Entities;

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
        public Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            IReadOnlyList<ServiceItem> items =
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

            return Task.FromResult(items);
        }

        public Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<ServiceItem?>(null);
        }
    }

    private sealed class FakeProductRepository : IProductRepository
    {
        public Task<IReadOnlyList<ProductItem>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            IReadOnlyList<ProductItem> items =
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

            return Task.FromResult(items);
        }

        public Task<ProductItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<ProductItem?>(null);
        }
    }

    private sealed class FakeAcademyRepository : IAcademyRepository
    {
        public Task<IReadOnlyList<AcademyTrack>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            IReadOnlyList<AcademyTrack> items =
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

            return Task.FromResult(items);
        }

        public Task<AcademyTrack?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<AcademyTrack?>(null);
        }
    }
}
