using System;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Defaults;

public static class MethodologyDefaults
{
    public static MethodologyPageStorage DefaultStorage { get; } = new(
        DefaultPage,
        DefaultOfferings);

    public static SaveMethodologyPageRequest DefaultPage { get; } = new(
        "Our Methodology to Collaboration",
        "Engagement models built around how you collaborate",
        "Explore the four delivery approaches we use to launch and scale products with you.",
        "We align ownership, delivery speed, and enablement so your team stays in control long after go-live.",
        new MediaResourceDto("bg.mp4", "/video/bg.mp4"),
        new[]
        {
            new StatHighlightDto("Engagement models", "4 delivery playbooks"),
            new StatHighlightDto("Tech specialists", "20+ senior engineers"),
            new StatHighlightDto("Onboarding", "Start in days, not months")
        },
        new[]
        {
            new MatrixColumnDto("team-augmentation", "Team Augmentation"),
            new MatrixColumnDto("mvp-development", "MVP Development"),
            new MatrixColumnDto("end-to-end-development", "Project Development"),
            new MatrixColumnDto("offshore-development", "Offshore Development")
        },
        new[]
        {
            new MatrixFeatureDto(
                "Access Top Industry Talent",
                new[] { "team-augmentation", "mvp-development", "end-to-end-development", "offshore-development" }),
            new MatrixFeatureDto(
                "Customize Solutions to Fit Your Needs",
                new[] { "team-augmentation", "mvp-development", "end-to-end-development" }),
            new MatrixFeatureDto("Expand Your Team Quickly", new[] { "team-augmentation", "offshore-development" }),
            new MatrixFeatureDto("Prototype Your Ideas", new[] { "mvp-development" }),
            new MatrixFeatureDto("Complete End-to-End Development", new[] { "end-to-end-development" }),
            new MatrixFeatureDto("Ensure Product Scalability", new[] { "end-to-end-development", "mvp-development" }),
            new MatrixFeatureDto(
                "Increase Development Speed",
                new[] { "team-augmentation", "mvp-development", "end-to-end-development" }),
            new MatrixFeatureDto(
                "Cost-Effective Development Solutions",
                new[] { "team-augmentation", "mvp-development", "end-to-end-development", "offshore-development" })
        },
        new[] { "Your name", "Company name", "Business mail", "Phone number", "About the project" });

    public static IReadOnlyList<MethodologyOfferingDto> DefaultOfferings { get; } =
    [
        new MethodologyOfferingDto(
            Guid.Parse("9a7b3c24-6b02-4ce1-9dd5-0a86a5d49ce0"),
            "team-augmentation",
            "IT Team Augmentation",
            "Maximize Your Team's Potential with Premium Resources",
            "Looking for top-tier IT staff augmentation services? We offer comprehensive solutions and highly skilled personnel to help you grow and strengthen your team.",
            new[]
            {
                "Don’t let understaffing hold you back. Maximize your team’s performance and reach your business goals with the best IT team augmentation.",
                "Team augmentation is a powerful outsourcing process that lets you expand your team with skilled professionals on an on-demand basis, without the friction of recruiting and onboarding full-time employees."
            },
            new[]
            {
                new StatHighlightDto("React engineers on tap", "20+ specialists"),
                new StatHighlightDto("Engagement start time", "Under 2 weeks"),
                new StatHighlightDto("Integration style", "Seamless & embedded")
            },
            new[]
            {
                new BenefitCardDto(
                    "Interact with the Top 1% of Refined Talent",
                    "Rigorous screening and extensive vetting lets you interview and select only the best developers who seamlessly integrate into your team."),
                new BenefitCardDto(
                    "Scale and Optimize Resources Quickly",
                    "Scale up or down at will—across roles and tech stacks—without long-term hiring overhead."),
                new BenefitCardDto(
                    "Expert Collaboration, On Demand",
                    "Dedicated developers work exclusively on your project, aligning to your processes and ceremonies while adding best practices."),
                new BenefitCardDto(
                    "Cost-Effective and Transparent",
                    "Predictable pricing and transparent reporting lets you focus on outcomes without surprise costs.")
            },
            new[]
            {
                new ProcessStepDto("Schedule a Call", "Share your goals and team needs."),
                new ProcessStepDto("Talent Requirements", "Define the skills, experience levels, and timelines you need."),
                new ProcessStepDto("Contract Signing", "Finalize agreements and onboarding guardrails."),
                new ProcessStepDto("Talent Allocation", "We assemble your team and integrate into your workflows."),
                new ProcessStepDto("Project Continues", "Continuous delivery with transparent communication and reporting.")
            },
            new MethodologyClosingDto(
                "Let Our Expertise Help Redefine Your Business!",
                new[]
                {
                    "Expert teams of dedicated software developers with customized strategies.",
                    "Trusted technology choices for maximum impact.",
                    "High-security standards with transparent reporting.",
                    "Scalable solutions that adapt to changing requirements.",
                    "Cost-efficient model that maximizes productivity."
                },
                "Build Your Tech Team"),
            true),
        new MethodologyOfferingDto(
            Guid.Parse("f89d4c21-3b2f-4a68-9a3e-0e62ea9824a4"),
            "mvp-development",
            "MVP Development Services",
            "Boost Your Product With Expert MVP Development Services",
            "Transform your vision into reality with our expert MVP software development services. We launch key software features that satisfy potential customers while balancing the project budget.",
            new[]
            {
                "MVP development is about quickly validating your product idea, gathering feedback from users, and iterating based on real-world insights.",
                "As a leading MVP development company, we help you identify core features and develop the product that meets your needs and goals."
            },
            new[]
            {
                new StatHighlightDto("Builders available", "20+ MVP specialists"),
                new StatHighlightDto("Engagement style", "Lean & experiment-driven")
            },
            new[]
            {
                new BenefitCardDto("Rapid Time-to-Market", "Launch your product quickly, gain user feedback, and validate early."),
                new BenefitCardDto("Risk Mitigation", "Validate your product concept before making significant investments."),
                new BenefitCardDto("Cost Efficiency", "Reduce risk and spend by focusing on the smallest lovable product before scaling."),
                new BenefitCardDto("Iterative Improvement", "Continuously improve based on user insights so the final product meets expectations.")
            },
            new[]
            {
                new ProcessStepDto("Schedule a Call", "Define your goals and budget guardrails."),
                new ProcessStepDto("MVP Planning", "Identify the core features that deliver value quickly."),
                new ProcessStepDto("Product Design", "Shape the MVP experience with a user-first lens."),
                new ProcessStepDto("Development Phase", "Build in agile sprints with continuous feedback."),
                new ProcessStepDto("Launch & Iterate", "Release, measure, and refine for full-scale development.")
            },
            new MethodologyClosingDto(
                "Launch Your Product with Confidence!",
                new[]
                {
                    "Strategic MVP scoping and feature prioritization.",
                    "User-centric design with continuous validation.",
                    "Fast iterations with clear deliverables.",
                    "Cost-effective builds tailored to your budget.",
                    "Scalable architecture for future growth."
                },
                "Start Your MVP"),
            true),
        new MethodologyOfferingDto(
            Guid.Parse("ad1c4ae9-8c7c-4d0b-9d31-8d1bfa23c6e8"),
            "end-to-end-development",
            "End-to-End Software Development",
            "Partner with an expert team to deliver your product from discovery to launch.",
            "Get a dedicated engineering team to handle architecture, development, testing, and release management—while collaborating closely with your stakeholders.",
            new[]
            {
                "We work as your long-term engineering partner, handling the full software lifecycle while integrating with your workflows.",
                "From discovery and design to deployment and observability, we deliver reliable software with predictable outcomes."
            },
            new[]
            {
                new StatHighlightDto("Delivery squads", "3 cross-functional pods"),
                new StatHighlightDto("Release cadence", "Weekly shipping"),
                new StatHighlightDto("Quality", "Automated testing and CI/CD")
            },
            new[]
            {
                new BenefitCardDto("Product Strategy & Discovery", "Workshops to clarify goals, prioritize features, and align stakeholders."),
                new BenefitCardDto("Full-Stack Delivery", "Backend, frontend, QA, and DevOps covered by a coordinated team."),
                new BenefitCardDto("Architecture for Scale", "Design for reliability, security, and growth from day one."),
                new BenefitCardDto("Transparent Project Management", "Roadmaps, burn-up charts, and demos keep everyone aligned.")
            },
            new[]
            {
                new ProcessStepDto("Discovery", "Define scope, constraints, and success metrics."),
                new ProcessStepDto("Design & Architecture", "Shape user journeys and system design."),
                new ProcessStepDto("Development", "Iterative delivery with code reviews and testing."),
                new ProcessStepDto("Launch", "Deploy with monitoring, alerts, and runbooks."),
                new ProcessStepDto("Operate & Improve", "Post-launch support and optimization.")
            },
            new MethodologyClosingDto(
                "Ship Faster with a Dedicated Team!",
                new[]
                {
                    "Cross-functional squads aligned to your roadmap.",
                    "Built-in quality through automation.",
                    "Predictable delivery with clear milestones.",
                    "Architecture that scales with your users.",
                    "Collaborative partnership with transparent communication."
                },
                "Plan Your Build"),
            true),
        new MethodologyOfferingDto(
            Guid.Parse("8b7f5c1d-0c0b-4f7c-9f3d-2b6e8d7c9e1f"),
            "offshore-development",
            "Offshore Development Center",
            "Build a dedicated offshore team to accelerate delivery and reduce costs.",
            "Set up a remote engineering hub with vetted talent, governance, and processes that mirror your in-house team.",
            new[]
            {
                "Access senior engineers across time zones with strong communication skills.",
                "Run agile delivery with reliable reporting, compliance, and security controls."
            },
            new[]
            {
                new StatHighlightDto("Security", "SOC2-inspired controls"),
                new StatHighlightDto("Time zone", "Full-day overlap with US/EU"),
                new StatHighlightDto("Ramp-up", "Teams ready in weeks")
            },
            new[]
            {
                new BenefitCardDto("Governance & Compliance", "Operational playbooks, access controls, and audit-friendly processes."),
                new BenefitCardDto("Cost Advantage", "Optimize budgets without compromising senior engineering quality."),
                new BenefitCardDto("Cultural Alignment", "Teams trained on communication, documentation, and delivery rituals."),
                new BenefitCardDto("Long-Term Partnership", "Stable squads that evolve with your roadmap.")
            },
            new[]
            {
                new ProcessStepDto("Define Goals", "Outline your offshore objectives and KPIs."),
                new ProcessStepDto("Team Assembly", "Build a tailored team across roles and seniority."),
                new ProcessStepDto("Security & Access", "Set up VPN, SSO, and permissions."),
                new ProcessStepDto("Execution", "Run sprints with demos, QA, and release management."),
                new ProcessStepDto("Optimize", "Evolve the engagement with metrics and feedback.")
            },
            new MethodologyClosingDto(
                "Scale with Confidence, Globally!",
                new[]
                {
                    "Dedicated offshore squads embedded into your workflows.",
                    "Security-first culture with transparent operations.",
                    "Cost-effective scaling without sacrificing quality.",
                    "Proactive communication and leadership support.",
                    "Long-term partnership focused on outcomes."
                },
                "Set Up Your ODC"),
            true)
    ];
}
