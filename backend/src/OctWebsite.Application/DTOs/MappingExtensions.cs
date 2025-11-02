using System.Linq;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.DTOs;

public static class MappingExtensions
{
    public static TeamMemberDto ToDto(this TeamMember member) => new(
        member.Id,
        member.Name,
        member.Role,
        member.PhotoUrl,
        member.Bio,
        member.Email,
        member.Active);

    public static CompanyAboutDto ToDto(this CompanyAbout about) => new(
        about.Id,
        about.Key,
        about.Content);

    public static ServiceItemDto ToDto(this ServiceItem service) => new(
        service.Id,
        service.Title,
        service.Slug,
        service.Summary,
        service.Icon,
        service.Features,
        service.Active);

    public static ProductItemDto ToDto(this ProductItem product) => new(
        product.Id,
        product.Title,
        product.Slug,
        product.Summary,
        product.Icon,
        product.Features,
        product.Active);

    public static AcademyTrackDto ToDto(this AcademyTrack track) => new(
        track.Id,
        track.Title,
        track.Slug,
        track.AgeRange,
        track.Duration,
        track.PriceLabel,
        track.Levels.Select(level => level.ToDto()).ToArray(),
        track.Active);

    public static AcademyTrackLevelDto ToDto(this AcademyTrackLevel level) => new(
        level.Name,
        level.Tools,
        level.Outcomes);

    public static BlogPostDto ToDto(this BlogPost post) => new(
        post.Id,
        post.Title,
        post.Slug,
        post.Excerpt,
        post.CoverUrl,
        post.Content,
        post.Tags,
        post.Published,
        post.PublishedAt);

    public static SiteSettingsDto ToDto(this SiteSettings settings) => new(
        settings.Id,
        settings.SiteTitle,
        settings.Tagline,
        settings.HeroTitle,
        settings.HeroSubtitle,
        settings.PrimaryCtaLabel,
        settings.HeroImageUrl,
        settings.HeroImageAlt,
        settings.HeroVideoUrl,
        settings.HeroVideoPoster,
        settings.HeroMediaBadge,
        settings.HeroMediaCaption);

    public static SiteSettings ToEntity(this SiteSettingsDto settings) => new(
        settings.Id,
        settings.SiteTitle,
        settings.Tagline,
        settings.HeroTitle,
        settings.HeroSubtitle,
        settings.PrimaryCtaLabel,
        settings.HeroImageUrl,
        settings.HeroImageAlt,
        settings.HeroVideoUrl,
        settings.HeroVideoPoster,
        settings.HeroMediaBadge,
        settings.HeroMediaCaption);

    public static LeadDto ToDto(this Lead lead) => new(
        lead.Id,
        lead.Name,
        lead.Email,
        lead.Phone,
        lead.Subject,
        lead.Message,
        lead.CreatedAt);
}
