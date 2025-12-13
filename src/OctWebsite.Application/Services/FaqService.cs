using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class FaqService(IFaqRepository repository) : IFaqService
{
    public async Task<IReadOnlyList<FaqDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var faqs = await repository.GetAllAsync(cancellationToken);
        return faqs
            .OrderBy(faq => faq.DisplayOrder)
            .ThenBy(faq => faq.Question)
            .Select(faq => faq.ToDto())
            .ToArray();
    }

    public async Task<FaqDto> CreateAsync(SaveFaqRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var faq = new Faq(Guid.NewGuid(), request.Question.Trim(), request.Answer.Trim(), request.DisplayOrder);
        var created = await repository.CreateAsync(faq, cancellationToken);
        return created.ToDto();
    }

    public async Task<FaqDto?> UpdateAsync(Guid id, SaveFaqRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Question = request.Question.Trim(),
            Answer = request.Answer.Trim(),
            DisplayOrder = request.DisplayOrder
        };

        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveFaqRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Question);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Answer);
        if (request.DisplayOrder < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(request.DisplayOrder), "Display order cannot be negative.");
        }
    }
}
