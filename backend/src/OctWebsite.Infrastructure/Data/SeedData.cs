using System;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Infrastructure.Data;

internal static class SeedData
{
    public static IReadOnlyList<TeamMember> TeamMembers { get; } =
    [
        new TeamMember(
            Guid.Parse("1b8c4d2c-1e41-4ba2-84d5-1d5e8a1f0a01"),
            "Sophia Rahman",
            "Chief Executive Officer",
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=640&q=80",
            "Sophia leads the strategic direction of ObjectCanvas, connecting vision with execution across teams.",
            "sophia@objectcanvas.com",
            true),
        new TeamMember(
            Guid.Parse("6a5345ce-66f6-4c81-88fb-3d69f739ba19"),
            "Arman Chowdhury",
            "Director of Engineering",
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=640&q=80",
            "Arman architects platform solutions for clients ranging from startups to enterprises.",
            "arman@objectcanvas.com",
            true),
        new TeamMember(
            Guid.Parse("95d4b3c3-22b6-4b63-9419-091223a2d4b2"),
            "Priya Sultana",
            "Head of ZeroProgramming Academy",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=640&q=80",
            "Priya curates outcome-based tracks that empower learners to build portfolio-ready skills.",
            "priya@zeroprogramming.academy",
            true),
        new TeamMember(
            Guid.Parse("0c1de8a6-7f87-4d38-92bf-3a86df206a26"),
            "Daniel Hasan",
            "Product Strategist",
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=640&q=80",
            "Daniel aligns client objectives with measurable KPIs and product roadmaps.",
            "daniel@objectcanvas.com",
            true)
    ];

    public static IReadOnlyList<CompanyAbout> About { get; } =
    [
        new CompanyAbout(
            Guid.Parse("b9ed8969-4ae2-4f73-a045-428b8274652a"),
            "overview",
            "ObjectCanvas Studios and ZeroProgrammingBD Academy partner to deliver full-spectrum digital innovation. Our blended team of engineers, designers, mentors, and strategists help organizations ship resilient products while enabling the next generation of makers."),
        new CompanyAbout(
            Guid.Parse("13b2d390-a3ad-4258-915c-34eaf56bd38b"),
            "mission",
            "Our mission is to unlock reliable software for every ambitious business while upskilling talent with industry-ready programs. We create an ecosystem where services and education fuel one another."),
        new CompanyAbout(
            Guid.Parse("adf0582d-00c9-4c66-9058-4ce0fd6cb8b7"),
            "vision",
            "We envision a region where founders, enterprises, and learners co-create the future—shipping human-centered platforms and jobs of tomorrow from right here in Bangladesh.")
    ];

    public static IReadOnlyList<ServiceItem> Services { get; } =
    [
        new ServiceItem(
            Guid.Parse("f5323454-8be0-4c8e-8d17-2f5667a3f1ab"),
            "Software Development",
            "software-development",
            "Dedicated squads delivering robust platforms, integrations, and cloud-native solutions.",
            "code",
            new[] { "Full-stack product teams", "Agile discovery & delivery", "Quality automation & DevOps" },
            true),
        new ServiceItem(
            Guid.Parse("c8bdb5b8-cd2e-43c2-9a05-5076b878f0ea"),
            "Website Development",
            "website-development",
            "High-performance marketing and corporate sites with modern composable stacks.",
            "globe",
            new[] { "Next-gen Jamstack builds", "CMS implementation", "Accessibility-first UI" },
            true),
        new ServiceItem(
            Guid.Parse("32f26e79-49af-4ae7-a26d-6ff5ec52ffb6"),
            "Mobile App Development",
            "mobile-app-development",
            "Cross-platform native experiences that your users love and trust.",
            "smartphone",
            new[] { "iOS and Android delivery", "Offline-first architectures", "App Store launch support" },
            true),
        new ServiceItem(
            Guid.Parse("f9cd91fa-2cb0-4f60-8b89-e6308d0d8791"),
            "Ecommerce Website",
            "ecommerce-website",
            "Conversion-optimized commerce platforms with secure checkout and automation.",
            "shopping-bag",
            new[] { "Headless commerce builds", "Payment & fulfillment integrations", "Growth analytics dashboard" },
            true)
    ];

    public static IReadOnlyList<ProductItem> Products { get; } =
    [
        new ProductItem(
            Guid.Parse("4fb0c5ec-41f9-44ac-b0a9-ccb8717345d5"),
            "Accounting-Inventory",
            "accounting-inventory",
            "A single source of truth for finances, inventory, and compliance.",
            "file-text",
            new[] { "Automated ledgers", "Purchase & sales workflows", "Compliance ready reports" },
            true),
        new ProductItem(
            Guid.Parse("1b238c58-9086-47d9-8c9a-a71a15fe4f27"),
            "POS Software",
            "pos-software",
            "Modern POS across retail channels with real-time stock syncing.",
            "credit-card",
            new[] { "Multi-branch support", "Inventory reconciliation", "Offline billing" },
            true),
        new ProductItem(
            Guid.Parse("0ee8f3dc-0162-4ba3-9faf-7d3bce84185f"),
            "Real Estate Management",
            "real-estate-management",
            "Lead-to-lease pipelines and smart property upkeep dashboards.",
            "home",
            new[] { "Unit availability tracking", "Tenant portal", "Expense analytics" },
            true),
        new ProductItem(
            Guid.Parse("9d7a8452-bd34-42a2-b51a-2e9f7dcc5b1e"),
            "Production Management",
            "production-management",
            "Monitor production cycles, downtime, and yield insights in one view.",
            "factory",
            new[] { "Workflow automation", "Maintenance alerts", "Operational dashboards" },
            true),
        new ProductItem(
            Guid.Parse("4cf942ed-1af5-4a92-bf66-1b7e24fabd90"),
            "Hardware Business",
            "hardware-business",
            "Distribution-ready platform for hardware inventory and procurement.",
            "cpu",
            new[] { "Supplier management", "Warranty tracking", "Analytics & forecasting" },
            true),
        new ProductItem(
            Guid.Parse("4c6e2c27-49c0-44cb-b881-d919cb0124a1"),
            "Mobile Shop Management",
            "mobile-shop-management",
            "Point of sale, buyback, and repair workflows in one simplified interface.",
            "smartphone",
            new[] { "IMEI tracking", "Repair management", "Bundle promotions" },
            true),
        new ProductItem(
            Guid.Parse("e9fc36dc-5983-4e61-8265-bc2a27c893fa"),
            "Electronics Showroom",
            "electronics-showroom",
            "Delightful catalog-first experience with AR/VR-ready modules.",
            "tv",
            new[] { "Product comparison", "Assisted selling tools", "Warranty automation" },
            true),
        new ProductItem(
            Guid.Parse("3a6e3b68-9175-4c76-a163-46339ca774b0"),
            "Distribution Management",
            "distribution-management",
            "Optimize distribution with intelligent routing and demand forecasting.",
            "truck",
            new[] { "Route planning", "Distributor portal", "Sales gamification" },
            true)
    ];

    public static IReadOnlyList<AcademyTrack> AcademyTracks { get; } =
    [
        new AcademyTrack(
            Guid.Parse("c8502826-f7c5-4b77-8584-60c9fb73ef2d"),
            "Kids Computing",
            "kids-computing",
            "Age 8-12",
            "16 weeks",
            "৳8,500",
            [
                new AcademyTrackLevel("Discover", new[] { "Scratch", "Micro:bit" }, new[] { "Fundamental logic skills", "Confidence with creative coding" }),
                new AcademyTrackLevel("Build", new[] { "Thunkable", "TinkerCAD" }, new[] { "Prototype hardware projects", "Story-driven games" })
            ],
            true),
        new AcademyTrack(
            Guid.Parse("9c8141b2-6539-44b3-9c1f-d9bca6f1e77a"),
            "Zero Programing",
            "zero-programing",
            "Age 13+",
            "20 weeks",
            "৳12,500",
            [
                new AcademyTrackLevel("No-Code Foundations", new[] { "Notion", "Zapier", "Bubble" }, new[] { "Ship workflows visually", "Launch MVPs without code" }),
                new AcademyTrackLevel("Automation Studio", new[] { "Make.com", "Airtable" }, new[] { "Automate business ops", "Build client-ready templates" }),
                new AcademyTrackLevel("Launchpad", new[] { "Webflow", "Figma" }, new[] { "Design to deploy landing pages", "Portfolio-ready case studies" })
            ],
            true),
        new AcademyTrack(
            Guid.Parse("7e8151fe-d683-4580-bf24-0d8257393d3b"),
            "Freelanching",
            "freelanching",
            null,
            "12 weeks",
            "৳9,500",
            [
                new AcademyTrackLevel("Profile Sprint", new[] { "Upwork", "Fiverr", "Behance" }, new[] { "Story-driven gig positioning", "Proposal frameworks that convert" }),
                new AcademyTrackLevel("Delivery Excellence", new[] { "ClickUp", "Loom" }, new[] { "Client communication playbook", "Repeat business strategies" })
            ],
            true)
    ];

    public static IReadOnlyList<BlogPost> BlogPosts { get; } =
    [
        new BlogPost(
            Guid.Parse("b0f34359-4f0c-4f1f-86e0-4b232d42928b"),
            "How We Blend Services with Learning",
            "blend-services-with-learning",
            "A behind-the-scenes look at how our delivery squads collaborate with academy mentors.",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
            "<p>Our dual-engine model creates a feedback loop between client projects and the academy. We share playbooks, tooling, and retrospectives with our learners so they build market-ready confidence.</p><p>Every sprint uncovers new teaching moments that shape ZeroProgrammingBD curriculum updates.</p>",
            new[] { "Culture", "Academy" },
            true,
            DateTimeOffset.Parse("2025-01-10T09:00:00.000Z")),
        new BlogPost(
            Guid.Parse("7b8fb0dd-7721-4e7b-a5e3-08f6d93e4a4f"),
            "Designing Reliable Commerce Experiences",
            "designing-reliable-commerce-experiences",
            "Discover the blueprints we use to launch commerce platforms that delight shoppers.",
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
            "<p>From modular UI kits to rigorous QA automation, we ensure ecommerce ecosystems stay performant under scale.</p><p>Our teams blend analytics with CRO experimentation to keep conversion at the center.</p>",
            new[] { "Commerce", "Product" },
            true,
            DateTimeOffset.Parse("2025-02-02T11:30:00.000Z")),
        new BlogPost(
            Guid.Parse("ec4554a2-22fd-4b4e-bdf6-7bc7566e1fe0"),
            "Preparing Learners for Freelancing Wins",
            "preparing-learners-for-freelancing-wins",
            "How we pair career coaching with portfolio challenges to help learners earn globally.",
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
            "<p>Freelancing success is more than technical skills. We mentor communication, pricing, and client operations.</p><p>Learners graduate with templates, scripts, and confidence to thrive independently.</p>",
            new[] { "Academy", "Career" },
            true,
            DateTimeOffset.Parse("2025-03-15T14:00:00.000Z"))
    ];

    public static SiteSettings SiteSettings { get; } = new(
        Guid.Parse("3d3d78a9-df62-44c9-9217-6f25cfcf380b"),
        "ObjectCanvas × ZeroProgrammingBD",
        "We build reliable software and empower future-ready talent.",
        "Innovative Software Solutions for Global Business",
        "Transforming digital challenges into opportunities with cross-functional teams dedicated to speed, quality, and enablement.",
        "Get Started",
        "/images/hero-collaboration.svg",
        "Hybrid ObjectCanvas and ZeroProgrammingBD team collaborating over shared delivery dashboards",
        "https://cdn.coverr.co/videos/coverr-engineers-collaborating-over-laptops-9050/1080p.mp4",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
        "Hybrid studio",
        "ObjectCanvas squads and ZeroProgrammingBD mentors co-create every launch.");
}
