using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Defaults;

public static class HomePageDefaults
{
    public static HomeHeroSectionRequest DefaultHero => new(
        "ObjectCanvas Technology",
        "One Alliance. Infinite Digital Outcomes.",
        "ObjectCanvas engineers mission-critical software and experiences while mentors deliver the talent to scale them. Together we help ambitious teams ship faster and learn smarter.",
        new CtaLinkRequest("Start Your Project", "/contact", null, null, null),
        new CtaLinkRequest("Explore Academy", "/academy", null, null, null),
        new HomeHighlightRequest("From Bangladesh to the World 🇧🇩", "Trusted by founders, enterprises, and governments across Asia, Europe, North America, the Middle East, and Australia."),
        new[]
        {
            "Tailored enterprise technology for global impact",
            "Dedicated project teams aligned with your timezone",
            "Live instructor-led courses with industry experts"
        },
        "/video/bg.mp4",
        "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80",
        new HomeFeaturePanelRequest(
            "Global Delivery Model",
            "Product squads meet academy mentors",
            "ObjectCanvas product strategists, engineers, and designers partner with instructors to align delivery rituals, documentation, and enablement from day one.",
            new[]
            {
                new HomeMetricRequest("Timezone aligned", "Asia · EU · NA", "accent"),
                new HomeMetricRequest("Delivery Velocity", "2x faster GTM", "emerald")
            },
            new HomePartnerRequest(
                "Trusted technology & academy partner",
                "Align business outcomes with skill transformation—ObjectCanvas Academy trains your teams to own and scale every solution we deploy.")));

    public static HomeTrustSectionRequest DefaultTrust => new(
        "Trusted by teams at",
        Array.Empty<HomeTrustLogoRequest>(),
        new[]
        {
            new HomeStatRequest("Projects Delivered", 500, "+", null),
            new HomeStatRequest("Countries Served", 50, "+", null),
            new HomeStatRequest("Students Trained", 10_000, "K+", null),
            new HomeStatRequest("Years Combined Experience", 15, "+", null)
        });

    public static IReadOnlyList<HomeTestimonialRequest> DefaultTestimonials => new[]
    {
        new HomeTestimonialRequest(
            "ObjectCanvas shipped a reliable MVP in weeks and documented every decision so our in-house team could take over confidently.",
            "Sarah Lin",
            "CTO, Arian Labs",
            "Singapore",
            5,
            "client",
            null),
        new HomeTestimonialRequest(
            "The academy instructors turned complex topics into approachable labs. Our interns now contribute to production services.",
            "Imran Chowdhury",
            "Engineering Manager, Walton",
            "Dhaka",
            5,
            "student",
            null)
    };
}
