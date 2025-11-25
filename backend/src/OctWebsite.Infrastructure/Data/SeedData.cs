using System.Text.Json;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Infrastructure.Data;

internal static class SeedData
{
    private const string AboutStorageKey = "about-page";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public static IReadOnlyList<TeamMember> TeamMembers { get; } =
    [
        new TeamMember(
            Guid.Parse("cb9f3c7a-1f29-4c6e-8a8f-84df2a9e63fd"),
            "Tasfic Solaiman",
            "Founder · Principal Engineer",
            string.Empty,
            "Architecture, product strategy, and engineering leadership. Based in Dhaka, Bangladesh.",
            string.Empty,
            true),
        new TeamMember(
            Guid.Parse("f3c3f83d-5e1c-4f6a-9b7b-1bf8a68efb4f"),
            "Senior Engineering Lead",
            "Full-stack & Cloud",
            string.Empty,
            "Distributed systems, performance, and delivery excellence. Based in Dhaka · Remote.",
            string.Empty,
            true),
        new TeamMember(
            Guid.Parse("12e3bdb2-48a2-4a09-8f0f-7a8f8b8a1f4e"),
            "Academy Lead",
            "Academy Lead",
            string.Empty,
            "Curriculum design, cohort facilitation, and mentorship. Based in Rajshahi, Bangladesh.",
            string.Empty,
            true),
        new TeamMember(
            Guid.Parse("a36c30c4-1a77-4d6b-8f43-7c2fd4f4e3e3"),
            "Design & Brand Partner",
            "Product Design",
            string.Empty,
            "Experience design, visual systems, and design ops. Based remotely.",
            string.Empty,
            true)
    ];

    public static IReadOnlyList<CompanyAbout> About { get; } =
    [
        new CompanyAbout(
            Guid.Parse("fa5bba4b-78f8-4e8f-9c48-4e6f1d0a4a57"),
            AboutStorageKey,
            Serialize(DefaultAboutRequest))
    ];

    private static SaveAboutPageRequest DefaultAboutRequest => new(
        "About Us",
        "ObjectCanvas Technology",
        "Engineering teams, educators, and strategists building products and people together.",
        null,
        "ObjectCanvas engineers, product strategists, data practitioners, and educators work as one integrated team. We combine delivery excellence with capability building so every engagement ships both outcomes and skills.",
        "Build products and people together",
        "To help ambitious teams design, build, and scale digital products while growing the next generation of engineers and creators across Bangladesh and beyond.",
        "A global product studio rooted in Bangladesh",
        "Our vision is to be a long-term technology and learning partner for global companies, proving that world-class products and talent can be built from Dhaka, Rajshahi and remote teams across the country.",
        null,
        [
            new SaveAboutValueRequest(
                "Craft over shortcuts",
                "We care deeply about code quality, design systems, and operational excellence instead of one-off hacks.",
                null),
            new SaveAboutValueRequest(
                "Teach while we build",
                "Every project is a chance to upskill clients, students, and our own team through pairing, documentation, and open playbooks.",
                null),
            new SaveAboutValueRequest(
                "Long-term partnerships",
                "We prefer fewer, deeper relationships where we can own outcomes, not just deliver tickets.",
                null)
        ],
        "From small experiments to a multi-discipline studio",
        "ObjectCanvas started as a focused engineering partner helping teams ship quickly. Over time, we evolved into a multi-discipline studio spanning product strategy, cloud-native engineering, data, design, and a dedicated academy for young and early-career talent.",
        null,
        "The team behind ObjectCanvas",
        "A compact, cross-functional group of builders, mentors, and operators working across product, platform, and academy tracks.",
        "This is a snapshot of the people you will pair with on strategy, delivery, and training.");

    private static string Serialize(SaveAboutPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);
}
