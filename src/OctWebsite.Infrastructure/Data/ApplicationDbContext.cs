using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Identity;
namespace OctWebsite.Infrastructure.Data;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<CompanyAbout> CompanyAboutEntries => Set<CompanyAbout>();
    public DbSet<ContactPage> ContactPages => Set<ContactPage>();
    public DbSet<AcademyTrack> AcademyTracks => Set<AcademyTrack>();
    public DbSet<AcademyTrackLevel> AcademyTrackLevels => Set<AcademyTrackLevel>();
    public DbSet<AdmissionStep> AdmissionSteps => Set<AdmissionStep>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();
    public DbSet<ServiceItem> ServiceItems => Set<ServiceItem>();
    public DbSet<ProductItem> ProductItems => Set<ProductItem>();
    public DbSet<ProductShowcaseItem> ProductShowcaseItems => Set<ProductShowcaseItem>();
    public DbSet<ServicesPage> ServicesPages => Set<ServicesPage>();
    public DbSet<ProductPage> ProductPages => Set<ProductPage>();
    public DbSet<HomeHeroSection> HomeHeroSections => Set<HomeHeroSection>();
    public DbSet<HomeTrustSection> HomeTrustSections => Set<HomeTrustSection>();
    public DbSet<HomeTestimonial> HomeTestimonials => Set<HomeTestimonial>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<CareerApplication> CareerApplications => Set<CareerApplication>();
    public DbSet<CareerPage> CareerPages => Set<CareerPage>();
    public DbSet<MethodologyData> MethodologyDataEntries => Set<MethodologyData>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("dbo");

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity.ToTable("TeamMembers");
            entity.HasKey(member => member.Id);
            entity.Property(member => member.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<CompanyAbout>(entity =>
        {
            entity.ToTable("CompanyAbout");
            entity.HasKey(about => about.Id);
            entity.Property(about => about.Id).ValueGeneratedNever();
            entity.HasIndex(about => about.Key).IsUnique();
        });

        modelBuilder.Entity<MethodologyData>(entity =>
        {
            entity.ToTable("MethodologyData");
            entity.HasKey(data => data.Id);
            entity.Property(data => data.Id).ValueGeneratedNever();
            entity.HasIndex(data => data.Key).IsUnique();
        });

        modelBuilder.Entity<AcademyTrack>(entity =>
        {
            entity.ToTable("AcademyTracks");
            entity.HasKey(track => track.Id);
            entity.Property(track => track.Id).ValueGeneratedNever();
            entity.Property(track => track.Title).IsRequired();
            entity.Property(track => track.Slug).IsRequired();
            entity.HasIndex(track => track.Slug).IsUnique();
            entity.Property(track => track.AgeRange).IsRequired();
            entity.Property(track => track.Duration).IsRequired();
            entity.Property(track => track.PriceLabel).IsRequired();
            entity.Property(track => track.Audience).IsRequired();
            entity.Property(track => track.Format).IsRequired();
            entity.Property(track => track.Summary).IsRequired();
            entity.Property(track => track.CallToActionLabel).IsRequired();

            var stringListConverter = new ValueConverter<List<string>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => JsonSerializer.Deserialize<List<string>>(json, JsonSerializerOptions.Default) ?? new List<string>());
            var stringListComparer = new ValueComparer<List<string>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value.GetHashCode())),
                list => list.ToList());

            entity.Property(track => track.Highlights)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
            entity.Property(track => track.LearningOutcomes)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<AdmissionStep>(entity =>
        {
            entity.ToTable("AdmissionSteps");
            entity.HasKey(step => step.Id);
            entity.Property(step => step.Id).ValueGeneratedNever();
            entity.Property(step => step.Title).IsRequired();
            entity.Property(step => step.Description).IsRequired();
            entity.HasOne(step => step.Track)
                .WithMany(track => track.AdmissionSteps)
                .HasForeignKey(step => step.TrackId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AcademyTrackLevel>(entity =>
        {
            entity.ToTable("AcademyTrackLevels");
            entity.HasKey(level => level.Id);
            entity.Property(level => level.Id).ValueGeneratedNever();
            entity.Property(level => level.Title).IsRequired();
            entity.Property(level => level.Duration).IsRequired();
            entity.Property(level => level.Description).IsRequired();
            entity.Property(level => level.Project).IsRequired();
            entity.Property(level => level.Image).IsRequired();
            entity.HasOne(level => level.Track)
                .WithMany(track => track.Levels)
                .HasForeignKey(level => level.TrackId)
                .OnDelete(DeleteBehavior.Cascade);

            var stringListConverter = new ValueConverter<List<string>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => JsonSerializer.Deserialize<List<string>>(json, JsonSerializerOptions.Default) ?? new List<string>());
            var stringListComparer = new ValueComparer<List<string>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value.GetHashCode())),
                list => list.ToList());

            entity.Property(level => level.Tools)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
            entity.Property(level => level.Outcomes)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.ToTable("BlogPosts");
            entity.HasKey(post => post.Id);
            entity.Property(post => post.Id).ValueGeneratedNever();
            entity.Property(post => post.Title).IsRequired();
            entity.Property(post => post.Slug).IsRequired();
            entity.HasIndex(post => post.Slug).IsUnique();
            entity.Property(post => post.Excerpt).IsRequired();
            entity.Property(post => post.Content).IsRequired();
            entity.Property(post => post.CreatedDate).IsRequired();

            var stringListConverter = new ValueConverter<IReadOnlyList<string>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => (IReadOnlyList<string>)(JsonSerializer.Deserialize<List<string>>(json, JsonSerializerOptions.Default) ?? new List<string>()));
            var stringListComparer = new ValueComparer<IReadOnlyList<string>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value == null ? 0 : value.GetHashCode())),
                list => list.ToList());

            var statConverter = new ValueConverter<IReadOnlyList<BlogStat>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => (IReadOnlyList<BlogStat>)(JsonSerializer.Deserialize<List<BlogStat>>(json, JsonSerializerOptions.Default) ?? new List<BlogStat>()));
            var statComparer = new ValueComparer<IReadOnlyList<BlogStat>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value == null ? 0 : value.GetHashCode())),
                list => list.ToList());

            entity.Property(post => post.Tags)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
            entity.Property(post => post.KeyPoints)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
            entity.Property(post => post.Stats)
                .HasConversion(statConverter)
                .Metadata.SetValueComparer(statComparer);
        });

        modelBuilder.Entity<ContactPage>(entity =>
        {
            entity.ToTable("ContactPages");
            entity.HasKey(page => page.Id);
            entity.Property(page => page.Id).ValueGeneratedNever();
            entity.Property(page => page.HeaderEyebrow).IsRequired();
            entity.Property(page => page.HeaderTitle).IsRequired();
            entity.Property(page => page.HeaderSubtitle).IsRequired();
            entity.Property(page => page.HeroMetaLine).IsRequired();
            entity.Property(page => page.PrimaryCtaLabel).IsRequired();
            entity.Property(page => page.PrimaryCtaLink).IsRequired();
            entity.Property(page => page.ConsultationOptions).IsRequired();
            entity.Property(page => page.RegionalSupport).IsRequired();
            entity.Property(page => page.NdaLabel).IsRequired();
            entity.Property(page => page.ResponseTime).IsRequired();
            entity.Property(page => page.OfficesEyebrow).IsRequired();
            entity.Property(page => page.OfficesTitle).IsRequired();
            entity.Property(page => page.OfficesDescription).IsRequired();
            entity.Property(page => page.MapEmbedUrl).IsRequired();
            entity.Property(page => page.MapTitle).IsRequired();
            entity.Property(page => page.Headquarters).IsRequired();
            entity.Property(page => page.ProfileDownloadLabel).IsRequired();
            entity.Property(page => page.ProfileDownloadUrl).IsRequired();

            var stringListConverter = new ValueConverter<List<string>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => JsonSerializer.Deserialize<List<string>>(json, JsonSerializerOptions.Default) ?? new List<string>());
            var stringListComparer = new ValueComparer<List<string>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value.GetHashCode())),
                list => list.ToList());

            var officeConverter = new ValueConverter<List<ContactOffice>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => JsonSerializer.Deserialize<List<ContactOffice>>(json, JsonSerializerOptions.Default) ?? new List<ContactOffice>());
            var officeComparer = new ValueComparer<List<ContactOffice>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value.GetHashCode())),
                list => list.ToList());

            entity.Property(page => page.Emails)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
            entity.Property(page => page.FormOptions)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
            entity.Property(page => page.BusinessHours)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
            entity.Property(page => page.Offices)
                .HasConversion(officeConverter)
                .Metadata.SetValueComparer(officeComparer);
        });

        modelBuilder.Entity<CareerPage>(entity =>
        {
            entity.ToTable("CareerPages");
            entity.HasKey(page => page.Id);
            entity.Property(page => page.Id).ValueGeneratedNever();
            entity.Property(page => page.HeaderEyebrow).IsRequired();
            entity.Property(page => page.HeaderTitle).IsRequired();
            entity.Property(page => page.HeaderSubtitle).IsRequired();
            entity.Property(page => page.HeroMetaLine).IsRequired();
            entity.Property(page => page.PrimaryCtaLabel).IsRequired();
            entity.Property(page => page.PrimaryCtaLink).IsRequired();
            entity.Property(page => page.ResponseTime).IsRequired();
        });

        modelBuilder.Entity<ServicesPage>(entity =>
        {
            entity.ToTable("ServicesPages");
            entity.HasKey(page => page.Id);
            entity.Property(page => page.Id).ValueGeneratedNever();
            entity.Property(page => page.HeaderEyebrow).IsRequired();
            entity.Property(page => page.HeaderTitle).IsRequired();
            entity.Property(page => page.HeaderSubtitle).IsRequired();
        });

        modelBuilder.Entity<ProductPage>(entity =>
        {
            entity.ToTable("ProductPages");
            entity.HasKey(page => page.Id);
            entity.Property(page => page.Id).ValueGeneratedNever();
            entity.Property(page => page.HeaderEyebrow).IsRequired();
            entity.Property(page => page.HeaderTitle).IsRequired();
            entity.Property(page => page.HeaderSubtitle).IsRequired();
        });

        modelBuilder.Entity<HomeHeroSection>(entity =>
        {
            entity.ToTable("HomeHeroSections");
            entity.HasKey(section => section.Id);
            entity.Property(section => section.Id).ValueGeneratedNever();
            entity.Property(section => section.Content).IsRequired();
        });

        modelBuilder.Entity<HomeTrustSection>(entity =>
        {
            entity.ToTable("HomeTrustSections");
            entity.HasKey(section => section.Id);
            entity.Property(section => section.Id).ValueGeneratedNever();
            entity.Property(section => section.Content).IsRequired();
        });

        modelBuilder.Entity<HomeTestimonial>(entity =>
        {
            entity.ToTable("HomeTestimonials");
            entity.HasKey(testimonial => testimonial.Id);
            entity.Property(testimonial => testimonial.Id).ValueGeneratedNever();
            entity.Property(testimonial => testimonial.Quote).IsRequired();
            entity.Property(testimonial => testimonial.Name).IsRequired();
            entity.Property(testimonial => testimonial.Title).IsRequired();
            entity.Property(testimonial => testimonial.Location).IsRequired();
            entity.Property(testimonial => testimonial.Type).IsRequired();
        });

        modelBuilder.Entity<ContactSubmission>(entity =>
        {
            entity.ToTable("ContactSubmissions");
            entity.HasKey(submission => submission.Id);
            entity.Property(submission => submission.Id).ValueGeneratedNever();
            entity.Property(submission => submission.Name).IsRequired();
            entity.Property(submission => submission.Email).IsRequired();
            entity.Property(submission => submission.Message).IsRequired();
            entity.Property(submission => submission.CreatedAt).IsRequired();
        });

        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.ToTable("Services");
            entity.HasKey(service => service.Id);
            entity.Property(service => service.Id).ValueGeneratedNever();
            entity.Property(service => service.Title).IsRequired();
            entity.Property(service => service.Slug).IsRequired();
            entity.HasIndex(service => service.Slug).IsUnique();
            entity.Property(service => service.Summary).IsRequired();

            var stringListConverter = new ValueConverter<IReadOnlyList<string>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => (IReadOnlyList<string>)(JsonSerializer.Deserialize<List<string>>(json, JsonSerializerOptions.Default)
                                                 ?? new List<string>()));
            var stringListComparer = new ValueComparer<IReadOnlyList<string>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) =>
                    HashCode.Combine(hash, value == null ? 0 : value.GetHashCode())
                ),
                list => list.ToList());


            entity.Property(service => service.Features)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<ProductItem>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Id).ValueGeneratedNever();
            entity.Property(product => product.Title).IsRequired();
            entity.Property(product => product.Slug).IsRequired();
            entity.HasIndex(product => product.Slug).IsUnique();
            entity.Property(product => product.Summary).IsRequired();
            entity.Property(product => product.Icon).IsRequired();

            var stringListConverter = new ValueConverter<IReadOnlyList<string>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => (IReadOnlyList<string>)(JsonSerializer.Deserialize<List<string>>(json, JsonSerializerOptions.Default)
                                                 ?? new List<string>()));
            var stringListComparer = new ValueComparer<IReadOnlyList<string>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) =>
                    HashCode.Combine(hash, value == null ? 0 : value.GetHashCode())
                ),
                list => list.ToList());

            entity.Property(product => product.Features)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<ProductShowcaseItem>(entity =>
        {
            entity.ToTable("ProductShowcaseItems");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Id).ValueGeneratedNever();
            entity.Property(item => item.Name).IsRequired();
            entity.Property(item => item.Slug).IsRequired();
            entity.HasIndex(item => item.Slug).IsUnique();
            entity.Property(item => item.Description).IsRequired();
            entity.Property(item => item.ImageUrl).IsRequired();
            entity.Property(item => item.BackgroundColor).IsRequired();
            entity.Property(item => item.ProjectScreenshotUrl).IsRequired();

            var stringListConverter = new ValueConverter<IReadOnlyList<string>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => (IReadOnlyList<string>)(JsonSerializer.Deserialize<List<string>>(json, JsonSerializerOptions.Default)
                                                 ?? new List<string>()));

            var stringListComparer = new ValueComparer<IReadOnlyList<string>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) =>
                    HashCode.Combine(hash, value == null ? 0 : value.GetHashCode())
                ),
                list => list.ToList());

            entity.Property(item => item.Highlights)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<JobPosting>(entity =>
        {
            entity.ToTable("JobPostings");
            entity.HasKey(posting => posting.Id);
            entity.Property(posting => posting.Id).ValueGeneratedNever();
            entity.Property(posting => posting.Title).IsRequired();
            entity.Property(posting => posting.Location).IsRequired();
            entity.Property(posting => posting.EmploymentType).IsRequired();
            entity.Property(posting => posting.Summary).IsRequired();
            entity.Property(posting => posting.PublishedAt).IsRequired();
            entity.Property(posting => posting.Active).IsRequired();
        });

        modelBuilder.Entity<CareerApplication>(entity =>
        {
            entity.ToTable("CareerApplications");
            entity.HasKey(application => application.Id);
            entity.Property(application => application.Id).ValueGeneratedNever();
            entity.Property(application => application.FullName).IsRequired();
            entity.Property(application => application.Email).IsRequired();
            entity.Property(application => application.CreatedAt).IsRequired();
            entity.Property(application => application.JobPostingId).IsRequired();

            entity.HasOne(application => application.JobPosting)
                .WithMany()
                .HasForeignKey(application => application.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

