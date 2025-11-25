using System.Linq;
using System.Text.Json;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Infrastructure.Data;

internal static class SeedData
{
    private const string AboutStorageKey = "about-page";
    private const string AcademyPageStorageKey = "academy-page";
    private const string AcademyTracksStorageKey = "academy-tracks";
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

    public static CompanyAbout AcademyTracks { get; } = new(
        Guid.Parse("c7b21e81-6bec-4d66-b2a6-3438aeaa52d7"),
        AcademyTracksStorageKey,
        Serialize(DefaultAcademyTracks));

    public static IReadOnlyList<CompanyAbout> CompanyAboutEntries { get; } =
        About.Append(AcademyPage).Append(AcademyTracks).ToArray();

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

    private static IReadOnlyList<AcademyTrackDto> DefaultAcademyTracks =>
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

    private static string Serialize(SaveAboutPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private static string Serialize(SaveAcademyPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private static string Serialize(IReadOnlyList<AcademyTrackDto> tracks)
        => JsonSerializer.Serialize(tracks, JsonOptions);

    private static AcademyTrackDto Map(Guid id, SaveAcademyTrackRequest request)
    {
        return new AcademyTrackDto(
            id,
            request.Title,
            request.Slug,
            request.AgeRange,
            request.Duration,
            request.PriceLabel,
            request.Audience,
            request.Format,
            request.Summary,
            CreateMedia(request.HeroVideoFileName),
            CreateMedia(request.HeroPosterFileName),
            request.Highlights.ToArray(),
            request.LearningOutcomes.ToArray(),
            request.Levels.Select(level => new AcademyTrackLevelDto(
                level.Title,
                level.Duration,
                level.Description,
                level.Tools.ToArray(),
                level.Outcomes.ToArray(),
                level.Project,
                level.Image)).ToArray(),
            request.AdmissionSteps.Select(step => new AdmissionStepDto(step.Title, step.Description)).ToArray(),
            request.CallToActionLabel,
            request.Active);
    }

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }
}
