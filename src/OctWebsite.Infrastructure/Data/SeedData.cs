using System;
using System.Linq;
using System.Text.Json;
using OctWebsite.Application.Defaults;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Infrastructure.Data;

internal static class SeedData
{
    private const string AboutStorageKey = "about-page";
    private const string AcademyPageStorageKey = "academy-page";
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

    public static CompanyAbout AcademyPage { get; } = new(
        Guid.Parse("8ccf6b48-9e2d-42d3-ae27-43b2446f7ff0"),
        AcademyPageStorageKey,
        Serialize(DefaultAcademyPageRequest));

    public static IReadOnlyList<CompanyAbout> CompanyAboutEntries { get; } =
        About.Append(AcademyPage).ToArray();

    public static IReadOnlyList<AcademyTrack> AcademyTracks { get; } = DefaultAcademyTracks;

    public static IReadOnlyList<BlogPost> BlogPosts { get; } = DefaultBlogPosts;

    public static IReadOnlyList<ServiceItem> Services { get; } =
        [
            CreateService(
            "11111111-1111-1111-1111-111111111111",
            "Web Application",
            "web-platform",
            "Enterprise-ready web platforms with resilient architectures, design systems, and conversion-focused experiences.",
            "🌐",
            new[]
            {
                "Responsive web applications with modern design systems",
                "API-first backends with security and observability built in",
                "Performance, accessibility, and SEO baked into every release"
            },
            "service-bg-01.jpg",
            true,
            true),
        CreateService(
            "22222222-2222-2222-2222-222222222222",
            "Windows Applications",
            "windows",
            "Secure desktop software for Windows ecosystems, aligned to enterprise governance and deployment needs.",
            "🪟",
            new[]
            {
                "UWP/WPF interfaces tuned for performance and accessibility",
                "Active Directory, Intune, and SCCM friendly deployments",
                "Automated QA, packaging, and release pipelines"
            },
            "service-bg-02.jpg"),
        CreateService(
            "33333333-3333-3333-3333-333333333333",
            "Apple Development",
            "apple",
            "Premium Apple-native experiences built with Swift, privacy-first patterns, and App Store rigor.",
            "🍎",
            new[]
            {
                "SwiftUI interfaces with motion and accessibility polish",
                "Wallet, HealthKit, and native services integrations",
                "App Store readiness: privacy, localization, and review support"
            },
            "service-bg-03.jpg"),
        CreateService(
            "44444444-4444-4444-4444-444444444444",
            "Android Development",
            "android",
            "High-performance Android applications with modern Kotlin stacks and reliable release trains.",
            "🤖",
            new[]
            {
                "Compose-driven UI with Material You theming",
                "Edge-to-cloud security with biometrics and encrypted storage",
                "Play Store optimization, testing, and staged rollouts"
            },
            "service-bg-04.jpg"),
        CreateService(
            "55555555-5555-5555-5555-555555555555",
            "IT Enabled Services",
            "it-enabled-services",
            "Managed IT services that align technology operations with business uptime, compliance, and cost goals.",
            "🛠️",
            new[]
            {
                "24/7 monitoring, incident response, and SRE practices",
                "Lifecycle management for assets, users, and policies",
                "Governance, risk, and compliance reporting"
            },
            "service-bg-05.jpg"),
        CreateService(
            "66666666-6666-6666-6666-666666666666",
            "System Integration",
            "system-integration",
            "Connecting CRMs, ERPs, data warehouses, and SaaS tools into a reliable ecosystem with clean data flows.",
            "🔗",
            new[]
            {
                "API gateway design and event-driven architectures",
                "Data mapping, cleansing, and master data governance",
                "Automated regression suites for integration points"
            },
            "service-bg-06.jpg"),
        CreateService(
            "77777777-7777-7777-7777-777777777777",
            "Cloud Services",
            "cloud-service",
            "Secure cloud foundations, migrations, and FinOps practices across AWS, Azure, and Google Cloud.",
            "☁️",
            new[]
            {
                "Landing zones, identity, and network hardening",
                "Kubernetes platforms with IaC and GitOps pipelines",
                "Cost governance with right-sizing and observability"
            },
            "service-bg-07.jpg",
            true),
        CreateService(
            "88888888-8888-8888-8888-888888888888",
            "Web Listing & Presence",
            "web-listing",
            "Centralized web listing management to keep locations, services, and offers accurate across the web.",
            "🧭",
            new[]
            {
                "Schema and metadata optimization for discoverability",
                "Syndication to directories, maps, and partner platforms",
                "Reputation monitoring with insights and response playbooks"
            },
            "service-bg-08.jpg"),
        CreateService(
            "99999999-9999-9999-9999-999999999999",
            "Cyber Security Services",
            "cyber-security-services",
            "Proactive security programs spanning prevention, detection, and rapid response.",
            "🛡️",
            new[]
            {
                "Security assessments, threat modeling, and penetration testing",
                "SOC enablement with SIEM, SOAR, and runbooks",
                "Zero trust architectures and employee security training"
            },
            "service-bg-09.jpg"),
        CreateService(
            "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "Enterprise Content Management",
            "enterprise-content-management",
            "Content platforms that streamline authoring, governance, and omnichannel delivery.",
            "🗂️",
            new[]
            {
                "Headless CMS implementations with workflow automation",
                "Document governance, retention, and compliance controls",
                "Personalized content delivery across web and mobile"
            },
            "service-bg-10.jpg"),
        CreateService(
            "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "Search Engine Optimization (SEO)",
            "search-engine-optimization-seo",
            "Performance-driven SEO that blends technical fixes, content, and authority building.",
            "🚀",
            new[]
            {
                "Technical SEO audits and Core Web Vitals remediation",
                "Content strategy with structured data and localization",
                "Backlink and digital PR campaigns with measurable lift"
            },
            "service-bg-11.jpg",
            true),
        CreateService(
            "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "Graphic Design Studio",
            "graphic-design",
            "Brand-aligned creative assets that translate across digital and physical touchpoints.",
            "🎨",
            new[]
            {
                "Visual identity systems and design language creation",
                "Campaign visuals, motion graphics, and illustration",
                "Production-ready assets with accessibility checks"
            },
            "service-bg-12.jpg")
    ];

    public static IReadOnlyList<ProductItem> Products { get; } =
        [
            new ProductItem(
                Guid.Parse("4fb0c5ec-41f9-44ac-b0a9-ccb8717345d5"),
                "Accounting-Inventory",
                "accounting-inventory",
                "A single source of truth for finances, inventory, and compliance.",
                "file-text",
                new[]
                {
                    "Automated ledgers",
                    "Purchase & sales workflows",
                    "Compliance ready reports"
                },
                true),
            new ProductItem(
                Guid.Parse("1b238c58-9086-47d9-8c9a-a71a15fe4f27"),
                "POS Software",
                "pos-software",
                "Modern POS across retail channels with real-time stock syncing.",
                "credit-card",
                new[]
                {
                    "Multi-branch support",
                    "Inventory reconciliation",
                    "Offline billing"
                },
                true),
            new ProductItem(
                Guid.Parse("0ee8f3dc-0162-4ba3-9faf-7d3bce84185f"),
                "Real Estate Management",
                "real-estate-management",
                "Lead-to-lease pipelines and smart property upkeep dashboards.",
                "home",
                new[]
                {
                    "Unit availability tracking",
                    "Tenant portal",
                    "Expense analytics"
                },
                true),
            new ProductItem(
                Guid.Parse("9d7a8452-bd34-42a2-b51a-2e9f7dcc5b1e"),
                "Production Management",
                "production-management",
                "Monitor production cycles, downtime, and yield insights in one view.",
                "factory",
                new[]
                {
                    "Workflow automation",
                    "Maintenance alerts",
                    "Operational dashboards"
                },
                true),
            new ProductItem(
                Guid.Parse("4cf942ed-1af5-4a92-bf66-1b7e24fabd90"),
                "Hardware Business",
                "hardware-business",
                "Distribution-ready platform for hardware inventory and procurement.",
                "cpu",
                new[]
                {
                    "Supplier management",
                    "Warranty tracking",
                    "Analytics & forecasting"
                },
                true),
            new ProductItem(
                Guid.Parse("4c6e2c27-49c0-44cb-b881-d919cb0124a1"),
                "Mobile Shop Management",
                "mobile-shop-management",
                "Point of sale, buyback, and repair workflows in one simplified interface.",
                "smartphone",
                new[]
                {
                    "IMEI tracking",
                    "Repair management",
                    "Bundle promotions"
                },
                true),
            new ProductItem(
                Guid.Parse("e9fc36dc-5983-4e61-8265-bc2a27c893fa"),
                "Electronics Showroom",
                "electronics-showroom",
                "Delightful catalog-first experience with AR/VR-ready modules.",
                "tv",
                new[]
                {
                    "Product comparison",
                    "Assisted selling tools",
                    "Warranty automation"
                },
                true),
            new ProductItem(
                Guid.Parse("3a6e3b68-9175-4c76-a163-46339ca774b0"),
                "Distribution Management",
                "distribution-management",
                "Optimize distribution with intelligent routing and demand forecasting.",
                "truck",
                new[]
                {
                    "Route planning",
                    "Distributor portal",
                    "Sales gamification"
                },
                true)
        ];

    public static ContactPage ContactPage { get; } = new()
    {
        Id = Guid.Parse("c8c9d5b2-b4e6-4f1f-b75d-0d5b4ce9f924"),
        HeaderEyebrow = "Contact",
        HeaderTitle = "Partner with ObjectCanvas × Bangladesh",
        HeaderSubtitle = "Share your goals and we will prepare a tailored action plan, timeline, and resourcing model.",
        HeroVideoFileName = "video/contact.mp4",
        HeroMetaLine = "Dhaka · Rajshahi · Remote",
        PrimaryCtaLabel = "Hire Our Team →",
        PrimaryCtaLink = "/contact#consultation",
        ConsultationOptions = "Schedule a discovery call, request a proposal, or invite us to an RFP.",
        RegionalSupport = "Dhaka · Singapore · Dubai · London · Toronto",
        Emails =
        [
            "partnerships@objectcanvas.com",
            "admissions@objectcanvas.com",
            "support@objectcanvas.com"
        ],
        FormOptions =
        [
            "Digital Marketing",
            "Software Development",
            "Website Building",
            "ObjectCanvas Academy Programs",
            "General Inquiry"
        ],
        NdaLabel = "I would like to sign an NDA prior to sharing sensitive information.",
        ResponseTime = "We respond within 24 business hours. For urgent queries, call +880 1315-220077.",
        OfficesEyebrow = "Our Awesome Offices",
        OfficesTitle = "Visit our teams in Bangladesh",
        OfficesDescription = "Drop by our offices or host a hybrid session with our Dhaka and Rajshahi teams.",
        Offices =
        [
            new ContactOffice(
                "Dhaka Office",
                "Ahmed Tower, Kemal Ataturk Ave",
                "Floor #11, 16 & 19 Ahmed Tower, 28–30 Kemal Ataturk Ave, Dhaka 1213, Bangladesh.",
                "/images/offices/dhaka-office.webp"),
            new ContactOffice(
                "Rajshahi Office",
                "Nilanjona (1st Floor)",
                "Nilanjona (1st Floor), 627–Ramchandrapur, Rajshahi 6100, Bangladesh.",
                "/images/offices/rajshahi-office.webp")
        ],
        MapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.7093978657114!2d90.39547967541172!3d23.7572962786824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf5539555555%3A0x555a0a3b6c1b58a!2sTejgaon%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd",
        MapTitle = "ObjectCanvas Bangladesh locations",
        Headquarters = "ObjectCanvas Studios & ObjectCanvas Academy, 12/2 Innovation Avenue, Tejgaon, Dhaka 1207",
        BusinessHours =
        [
            "Sun-Thu: 9:00 AM - 6:00 PM (GMT+6)",
            "Fri-Sat: Closed"
        ],
        ProfileDownloadLabel = "Download Company Profile (PDF)",
        ProfileDownloadUrl = "https://objectcanvas.com/company-profile.pdf"
    };

    public static CareerPage CareerPage { get; } = new()
    {
        Id = Guid.Parse("b0c2b7fa-1ed3-4b3c-8c83-0dd9efed3a5c"),
        HeaderEyebrow = "Careers",
        HeaderTitle = "Build products and skills with us",
        HeaderSubtitle = "Join a team shipping ambitious products for clients while investing in your growth.",
        HeroVideoFileName = "video/careers.mp4",
        HeroMetaLine = "Hybrid teams across Dhaka, Rajshahi, and remote",
        PrimaryCtaLabel = "View open roles",
        PrimaryCtaLink = "/careers#open-roles",
        ResponseTime = "We review all applications within 3 business days.",
    };

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

    private static SaveAcademyPageRequest DefaultAcademyPageRequest => new(
        "Zero Programming Academy",
        "Ignite imagination with code, creativity, and community.",
        "Our academy fuses vibrant visuals, interactive labs, and compassionate mentorship to empower children, teens, and young professionals to thrive.",
        "Our academy fuses vibrant visuals, interactive labs, and compassionate mentorship to empower children, teens, and young professionals to thrive.",
        null,
        new[]
        {
            new AcademyFeatureDto("STEM.org Accredited", "Dolor sit am Provide Ipsum learning tailored for young innovators.", "🎓"),
            new AcademyFeatureDto("Project Based Learning", "Build games, animations, and inventions that spark curiosity.", "🧠"),
            new AcademyFeatureDto("Skilled Instructors", "Mentors who translate complex topics into playful experiences.", "👩‍🏫"),
            new AcademyFeatureDto("Comprehensive Curriculum", "Progressive modules covering coding, robotics, and creativity.", "📘"),
            new AcademyFeatureDto("Small Batch Size", "Maximum 10 students to ensure every child receives attention.", "🤝")
        },
        new[]
        {
            new FreelancingCourseDto("Web Development", "Modern stacks, responsive design, and client collaboration skills.", "💻"),
            new FreelancingCourseDto("Graphics & Branding", "Logo design, brand systems, and storytelling with visuals.", "🎨"),
            new FreelancingCourseDto("Digital Marketing", "Learn funnels, SEO, and automation for online success.", "📈")
        });

    private static ServiceItem CreateService(
        string id,
        string title,
        string slug,
        string summary,
        string icon,
        IReadOnlyList<string> features,
        string backgroundFileName,
        bool active = true,
        bool featured = false)
    {
        return new ServiceItem(
            Guid.Parse(id),
            title,
            null,
            slug,
            summary,
            summary,
            icon,
            backgroundFileName,
            features,
            active,
            featured);
    }

    private static IReadOnlyList<AcademyTrack> DefaultAcademyTracks =>
    [
        Map(Guid.Parse("2b3cba73-77cb-4459-b18d-47fc63df872d"),
            new SaveAcademyTrackRequest(
                "Track-1",
                "track-1-little-programmer",
                "For ages 7-8",
                "9 months",
                string.Empty,
                "Ages 7-8 · Beginners",
                "Live online · Small batches",
                "A playful introduction to coding through visual programming, math puzzles, and design prompts. Learners build confidence by creating their own stories, games, and websites.",
                "/video/academy/track-1.mp4",
                "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
                new[]
                {
                    "STEM.org-aligned visual programming curriculum",
                    "Focus on imagination, sequencing, and creative storytelling",
                    "Weekly design showcases to celebrate progress"
                },
                new[]
                {
                    "Introduction to coding and programming language basics",
                    "Sequences, simple math concepts, conditionals, and user events",
                    "Loops, building games, and designing animated stories",
                    "Website structure fundamentals: headers, footers, images, and forms"
                },
                new[]
                {
                    new SaveAcademyTrackLevelRequest(
                        "Level 1 · ScratchJr",
                        "4 months",
                        "Drag-and-drop programming that builds sequencing skills and inspires storytelling through characters, backgrounds, and sounds.",
                        new[] { "ScratchJr" },
                        new[] { "Coding fundamentals", "Conditional thinking", "Animating original stories" },
                        "Create an animated storybook that responds to taps and swipes.",
                        "https://images.unsplash.com/photo-1501696461415-6bd6660c6746?auto=format&fit=crop&w=1200&q=80"),
                    new SaveAcademyTrackLevelRequest(
                        "Level 2 · Scratch",
                        "4 months",
                        "Advance to richer game mechanics, scoring systems, and interactive animations using visual blocks and variables.",
                        new[] { "Scratch" },
                        new[] { "Loops and variables", "User events and scoring", "Game design fundamentals" },
                        "Build a multi-level arcade game with custom sprites and sound effects.",
                        "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80"),
                    new SaveAcademyTrackLevelRequest(
                        "Level 3 · Wix Website",
                        "1 month",
                        "Design a personal website with sections, galleries, and forms while learning the parts of a web page and good layout habits.",
                        new[] { "Wix" },
                        new[] { "Website design fundamentals", "Working with images and forms", "Personal site launch" },
                        "Publish a personal profile website with an “About me” and project gallery.",
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80")
                },
                new[]
                {
                    new SaveAdmissionStepRequest("Register", "Sign up for a free trial class to meet the mentor and see the toolkit."),
                    new SaveAdmissionStepRequest("Experience", "Your child attends the trial and explores interactive challenges."),
                    new SaveAdmissionStepRequest("Connect", "Our team shares feedback, the roadmap, and answers parent questions."),
                    new SaveAdmissionStepRequest("Enroll", "Confirm the seat with the first payment and receive orientation materials.")
                },
                "Book a FREE Trial Class",
                true)),
        Map(Guid.Parse("1dbd9f38-5bc2-4f25-8d3a-70c36a4ca3c4"),
            new SaveAcademyTrackRequest(
                "Track-2",
                "track-2-young-builder",
                "For ages 9-10",
                "9 months",
                string.Empty,
                "Ages 9-12 · Confident explorers",
                "Live online · Project-based studios",
                "Bridging visual coding to text-based thinking. Learners deepen logic with sensors, dive into Python play, and ship their first responsive web stories.",
                "/video/academy/track-2.mp4",
                "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1600&q=80",
                new[]
                {
                    "Maker challenges mixing hardware simulations and creative code",
                    "Weekly code reviews with mentors for debugging confidence",
                    "Showcase nights for family and friends every month"
                },
                new[]
                {
                    "Master conditional logic, sensors, and event-driven flows",
                    "Transition from blocks to Python syntax with clean code habits",
                    "Design responsive web pages with reusable components",
                    "Plan, storyboard, and present projects with clarity"
                },
                new[]
                {
                    new SaveAcademyTrackLevelRequest(
                        "Level 1 · Creative Coding Lab",
                        "3 months",
                        "Advanced block programming with sensors, sound design, and multiplayer-style mechanics to stretch logic skills.",
                        new[] { "Scratch", "micro:bit simulator" },
                        new[] { "Sensor-driven games", "State management with variables", "Event orchestration" },
                        "Design a cooperative game that reacts to sound, timers, and player choices.",
                        "https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=1200&q=80"),
                    new SaveAcademyTrackLevelRequest(
                        "Level 2 · Python Playgrounds",
                        "3 months",
                        "Move into text-based coding with Turtle art, mini-games, and data stories. Emphasis on readable code and debugging.",
                        new[] { "Python", "Turtle", "Pygame Zero" },
                        new[] { "Loops and functions", "Debugging practices", "Math-driven visuals" },
                        "Create a mini-game with keyboard controls, scoring, and motion physics.",
                        "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&q=80"),
                    new SaveAcademyTrackLevelRequest(
                        "Level 3 · Interactive Web Stories",
                        "3 months",
                        "Build responsive pages with layouts, typography, forms, and simple animations to tell personal or community stories.",
                        new[] { "HTML", "CSS", "Canva" },
                        new[] { "Responsive layouts", "Accessibility-first design", "Form handling basics" },
                        "Launch a multi-section story site featuring interviews, galleries, and a contact form.",
                        "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80")
                },
                new[]
                {
                    new SaveAdmissionStepRequest("Register", "Reserve a seat and share the learner’s interests and past projects."),
                    new SaveAdmissionStepRequest("Trial Studio", "Join a live studio session to explore sensors, Python, and design prompts."),
                    new SaveAdmissionStepRequest("Roadmap Review", "Mentor provides skill mapping and recommends the best pacing."),
                    new SaveAdmissionStepRequest("Enroll", "Lock in the schedule, get the starter kit, and meet the learning pod.")
                },
                "Book a FREE Trial Class",
                true)),
        Map(Guid.Parse("1ec7cc6a-696f-4495-b3b9-78e5592778f1"),
            new SaveAcademyTrackRequest(
                "Track-3",
                "track-3-future-founder",
                "For ages 11-16",
                "10 months",
                string.Empty,
                "Ages 12-16 · Portfolio-ready makers",
                "Live online · Studio labs + mentoring",
                "From front-end craft to entrepreneurship. Learners design polished interfaces, build web apps, and graduate with a portfolio plus freelancing playbooks.",
                "/video/academy/track-3.mp4",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
                new[]
                {
                    "Design + build cycles with critique from product mentors",
                    "Career labs covering proposals, client communication, and pricing",
                    "Demo day to present capstone apps to parents and peers"
                },
                new[]
                {
                    "Strong foundations in HTML, CSS, JavaScript, and component-based UI",
                    "Rapid prototyping with Figma and Webflow for production-quality pages",
                    "Collaboration using GitHub, issue tracking, and code reviews",
                    "Freelancing readiness: proposals, scoping, and delivery rituals"
                },
                new[]
                {
                    new SaveAcademyTrackLevelRequest(
                        "Level 1 · Frontend Foundations",
                        "3 months",
                        "Deep dive into semantic HTML, modern CSS, and JavaScript fundamentals with hands-on landing page builds.",
                        new[] { "HTML", "CSS", "JavaScript", "Tailwind" },
                        new[] { "Responsive layouts", "Reusable components", "Accessibility-first UI" },
                        "Ship a responsive brand site with animations, forms, and a component library.",
                        "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80"),
                    new SaveAcademyTrackLevelRequest(
                        "Level 2 · Product Studio",
                        "3 months",
                        "Prototype and publish with Figma and Webflow/Bubble, focusing on UX flows, CMS content, and launch checklists.",
                        new[] { "Figma", "Webflow", "Bubble" },
                        new[] { "UX prototyping", "CMS-driven sites", "Launch-readiness" },
                        "Design and publish a marketing site with CMS collections and animations.",
                        "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1200&q=80"),
                    new SaveAcademyTrackLevelRequest(
                        "Level 3 · Freelance Launchpad",
                        "4 months",
                        "Career labs on positioning, proposals, delivery rituals, and client communication paired with real project simulations.",
                        new[] { "GitHub", "Notion", "Upwork" },
                        new[] { "Portfolio storytelling", "Proposal frameworks", "Client-ready documentation" },
                        "Deliver a capstone web app with repository, documentation, and recorded walkthrough.",
                        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80")
                },
                new[]
                {
                    new SaveAdmissionStepRequest("Apply", "Share interests, prior coding exposure, and target outcomes."),
                    new SaveAdmissionStepRequest("Trial Build", "Join a studio lab to prototype with guidance from mentors."),
                    new SaveAdmissionStepRequest("Plan", "Receive a personalized roadmap and capstone proposal outline."),
                    new SaveAdmissionStepRequest("Launch", "Secure enrollment, set milestones, and join the cohort community.")
                },
                "Book a FREE Trial Class",
                true))
    ];

    public static ServicesPage ServicesPage { get; } = new()
    {
        Id = Guid.Parse("cf0bfe6f-4d68-4d2d-97b7-4b5f998b3c46"),
        HeaderEyebrow = "Services",
        HeaderTitle = "Services shaped to match your brand energy",
        HeaderSubtitle = "Engineering, cloud, security, content, and outsourcing squads that mirror the tone of your product and customers.",
        HeroVideoFileName = null
    };

    public static ProductPage ProductPage { get; } = new()
    {
        Id = Guid.Parse("7e5f8e9b-1d24-4b82-8d60-2f6a7c86f45d"),
        HeaderEyebrow = "Products",
        HeaderTitle = "Product playbooks to ship, learn, and iterate",
        HeaderSubtitle = "Modular squads that co-design strategy, experience, and delivery so your roadmap stays aligned to outcomes.",
        HeroVideoFileName = null
    };

    private static IReadOnlyList<BlogPost> DefaultBlogPosts =>
    [
        new BlogPost(
            Guid.Parse("b0f34359-4f0c-4f1f-86e0-4b232d42928b"),
            "How We Blend Services with Learning",
            "blend-services-with-learning",
            "A behind-the-scenes look at how our delivery squads collaborate with academy mentors.",
            "<p>Our dual-engine model creates a feedback loop between client projects and the academy. We share playbooks, tooling, and retrospectives with our learners so they build market-ready confidence.</p><p>Every sprint uncovers new teaching moments that shape curriculum updates. Delivery teams surface real-world blockers and our faculty convert them into masterclasses, templates, and walkthroughs the same week.</p><p>By pairing practitioners with mentors, we ship production features and learning assets in parallel, so every engagement improves the next cohort’s outcomes.</p>",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
            "/video/blog.mp4",
            new[] { "Culture", "Academy" },
            true,
            DateTimeOffset.Parse("2025-01-10T09:00:00.000Z"),
            "Ada Ncube",
            "Director of Delivery",
            "7 min read",
            "“Building together is how we keep our academy grounded in what teams truly need.”",
            new[]
            {
                "Sprints double as live curriculum labs.",
                "Mentors and engineers review retros together every Friday.",
                "Templates, checklists, and decision logs ship to learners weekly.",
            },
            new[]
            {
                new BlogStat("Academy playbooks shipped", "42"),
                new BlogStat("Avg. sprint NPS", "9.3"),
                new BlogStat("Countries represented", "18"),
            },
            DateTimeOffset.Parse("2025-01-10T09:00:00.000Z"),
            DateTimeOffset.Parse("2025-01-10T09:00:00.000Z")),
        new BlogPost(
            Guid.Parse("7b8fb0dd-7721-4e7b-a5e3-08f6d93e4a4f"),
            "Designing Reliable Commerce Experiences",
            "designing-reliable-commerce-experiences",
            "Discover the blueprints we use to launch commerce platforms that delight shoppers.",
            "<p>From modular UI kits to rigorous QA automation, we ensure ecommerce ecosystems stay performant under scale.</p><p>Our teams blend analytics with CRO experimentation to keep conversion at the center. Each launch is instrumented with product analytics, A/B testing, and synthetic monitoring so we can recover issues before customers notice.</p><p>Design systems keep merchandising, campaigns, and loyalty flows consistent while micro-optimizations deliver compound conversion gains.</p>",
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
            "/video/blog.mp4",
            new[] { "Commerce", "Product" },
            true,
            DateTimeOffset.Parse("2025-02-02T11:30:00.000Z"),
            "Devin Mora",
            "Product Design Lead",
            null,
            "“Reliability is the most underrated UX pattern in commerce.”",
            new[]
            {
                "Launch playbooks for flash sales and peak events.",
                "Conversion experiments run weekly with paired analysts.",
                "Observability and QA checks guard the checkout funnel.",
            },
            new[]
            {
                new BlogStat("Checkout uptime", "99.95%"),
                new BlogStat("A/B tests shipped", "60+"),
                new BlogStat("Avg. uplift per experiment", "+3.1%"),
            },
            DateTimeOffset.Parse("2025-02-02T11:30:00.000Z"),
            DateTimeOffset.Parse("2025-02-02T11:30:00.000Z")),
        new BlogPost(
            Guid.Parse("ec4554a2-22fd-4b4e-bdf6-7bc7566e1fe0"),
            "Preparing Learners for Freelancing Wins",
            "preparing-learners-for-freelancing-wins",
            "How we pair career coaching with portfolio challenges to help learners earn globally.",
            "<p>Freelancing success is more than technical skills. We mentor communication, pricing, and client operations.</p><p>Learners graduate with templates, scripts, and confidence to thrive independently. Demo days simulate client calls, contract reviews, and scope changes so learners rehearse scenarios before they encounter them.</p><p>Alumni pair up with current cohorts for accountability and pitch feedback, creating a global support circle that keeps momentum high.</p>",
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
            "/video/blog.mp4",
            new[] { "Academy", "Career" },
            true,
            DateTimeOffset.Parse("2025-03-15T14:00:00.000Z"),
            "Ifeoma James",
            "Head of Talent Labs",
            "6 min read",
            "“The most confident freelancer is the one who practiced every tricky scenario.”",
            new[]
            {
                "Mock client calls every Thursday with real founders.",
                "Pricing labs cover retainers, milestones, and royalties.",
                "Alumni mentors rotate monthly to keep guidance current.",
            },
            new[]
            {
                new BlogStat("Portfolio launches", "120+"),
                new BlogStat("Avg. first contract", "$2,800"),
                new BlogStat("Countries in talent cloud", "22"),
            },
            DateTimeOffset.Parse("2025-03-15T14:00:00.000Z"),
            DateTimeOffset.Parse("2025-03-15T14:00:00.000Z")),
        new BlogPost(
            Guid.Parse("a16cf8f7-6c9a-4d8c-8f3c-0c7fd2148f21"),
            "How We Prototype AI Features in 5 Days",
            "prototype-ai-features-fast",
            "A repeatable sprint framework for validating AI-powered experiences without derailing your roadmap.",
            "<p>AI ideas fail when they stay abstract. We run a five-day prototyping sprint that moves from opportunity mapping to a working demo in front of users.</p><p>Day 1 aligns on the workflow being improved. Day 2 selects the smallest model and dataset that can prove value. By Day 4 we have a working vertical slice that testers can touch, while Day 5 is about measurement and next steps.</p><p>The result is an evidence-backed backlog: what to productionize, what to discard, and what to park for later.</p>",
            "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80",
            "/video/blog.mp4",
            new[] { "AI", "Product" },
            true,
            DateTimeOffset.Parse("2025-04-09T10:00:00.000Z"),
            "Ravi Kulkarni",
            "Principal Product Strategist",
            "8 min read",
            "“Speed is less about the model and more about unblocking decisions.”",
            new[]
            {
                "Start with the workflow, not the algorithm.",
                "Bias toward smallest viable dataset and model.",
                "Ship a measurable vertical slice before scaling.",
            },
            new[]
            {
                new BlogStat("Prototypes shipped", "28"),
                new BlogStat("Median sprint length", "5 days"),
                new BlogStat("Ideas shelved early", "14"),
            },
            DateTimeOffset.Parse("2025-04-09T10:00:00.000Z"),
            DateTimeOffset.Parse("2025-04-09T10:00:00.000Z")),
        new BlogPost(
            Guid.Parse("f3e6d0f2-5c5c-4119-9a1f-3bd114f9f00b"),
            "Community-Driven Documentation That Engineers Actually Use",
            "community-driven-documentation",
            "How we keep docs living, trusted, and discoverable across a fast-moving product org.",
            "<p>Documentation decays when it lacks owners. We run quarterly doc jams, paired reviews, and release notes automation so engineers have a single trusted source of truth.</p><p>Living diagrams, ADRs, and onboarding paths stay current because squads earn points for each improvement. Those points convert into learning stipends, keeping contribution rewarding.</p><p>In the last quarter alone, 70% of doc updates came from engineers outside the platform team.</p>",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
            "/video/blog.mp4",
            new[] { "Engineering", "Culture" },
            true,
            DateTimeOffset.Parse("2025-05-02T08:30:00.000Z"),
            "Sara Onyango",
            "Staff Engineer, Platform",
            null,
            "“Docs are our product’s memory—treat them like a feature, not a chore.”",
            new[]
            {
                "Doc jams rotate across squads with structured prompts.",
                "Automations sync release notes to guides weekly.",
                "Contribution points fund conferences and courses.",
            },
            new[]
            {
                new BlogStat("Active contributors", "63"),
                new BlogStat("Docs updated quarterly", "210"),
                new BlogStat("Support tickets reduced", "31%"),
            },
            DateTimeOffset.Parse("2025-05-02T08:30:00.000Z"),
            DateTimeOffset.Parse("2025-05-02T08:30:00.000Z")),
        new BlogPost(
            Guid.Parse("d7ae1b92-22af-4f4c-9cf6-4cd4709c97d3"),
            "Design Ops Rituals for Calm, High-Velocity Teams",
            "design-ops-rituals",
            "The meeting rhythms, asset systems, and scorecards that keep designers shipping without chaos.",
            "<p>Design ops is the runway for high-performing teams. We keep weekly rituals tight: Monday planning with product, Wednesday critique, Friday system housekeeping.</p><p>Each ritual is time-boxed with clear decision owners. A shared asset library, status dashboards, and scorecards mean designers always know what “good” looks like.</p><p>As a result, PR feedback loops are faster, and handoffs to engineering are predictable.</p>",
            "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
            "/video/blog.mp4",
            new[] { "Design", "Culture" },
            true,
            DateTimeOffset.Parse("2025-05-22T12:00:00.000Z"),
            "Leah Benton",
            "Design Operations Manager",
            "5 min read",
            "“Calm teams ship more because they know exactly when decisions get made.”",
            new[]
            {
                "Three recurring rituals with tight agendas.",
                "Scorecards clarify expectations for every project.",
                "Asset systems keep dev handoffs lightweight.",
            },
            new[]
            {
                new BlogStat("Avg. design cycle time", "-18%"),
                new BlogStat("Critique attendance", "96%"),
                new BlogStat("Design-to-dev rework", "-24%"),
            },
            DateTimeOffset.Parse("2025-05-22T12:00:00.000Z"),
            DateTimeOffset.Parse("2025-05-22T12:00:00.000Z"))
    ];

    private static string Serialize(SaveAboutPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private static string Serialize(SaveAcademyPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private static AcademyTrack Map(Guid id, SaveAcademyTrackRequest request)
    {
        return new AcademyTrack
        {
            Id = id,
            Title = request.Title,
            Slug = request.Slug,
            AgeRange = request.AgeRange,
            Duration = request.Duration,
            PriceLabel = request.PriceLabel,
            Audience = request.Audience,
            Format = request.Format,
            Summary = request.Summary,
            HeroVideoFileName = request.HeroVideoFileName,
            HeroPosterFileName = request.HeroPosterFileName,
            Highlights = request.Highlights.ToList(),
            LearningOutcomes = request.LearningOutcomes.ToList(),
            Levels = request.Levels.Select((level, index) => new AcademyTrackLevel
            {
                Id = Guid.NewGuid(),
                TrackId = id,
                Title = level.Title,
                Duration = level.Duration,
                Description = level.Description,
                Tools = level.Tools.ToList(),
                Outcomes = level.Outcomes.ToList(),
                Project = level.Project,
                Image = level.Image,
                Order = index
            }).ToList(),
            AdmissionSteps = request.AdmissionSteps.Select((step, index) => new AdmissionStep
            {
                Id = Guid.NewGuid(),
                TrackId = id,
                Title = step.Title,
                Description = step.Description,
                Order = index
            }).ToList(),
            CallToActionLabel = request.CallToActionLabel,
            Active = request.Active
        };
    }
}
