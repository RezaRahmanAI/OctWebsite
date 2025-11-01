using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OctWebsite.Domain.Entities;
using System.Text.Json;

namespace OctWebsite.Infrastructure.Data;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<CompanyAbout> CompanyAboutEntries => Set<CompanyAbout>();
    public DbSet<ServiceItem> ServiceItems => Set<ServiceItem>();
    public DbSet<ProductItem> ProductItems => Set<ProductItem>();
    public DbSet<AcademyTrack> AcademyTracks => Set<AcademyTrack>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();
    public DbSet<Lead> Leads => Set<Lead>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var stringListConverter = new ValueConverter<IReadOnlyList<string>, string>(
            value => JsonSerializer.Serialize(value ?? Array.Empty<string>(), JsonOptions),
            json => JsonSerializer.Deserialize<IReadOnlyList<string>>(json, JsonOptions) ?? Array.Empty<string>());

        var stringListComparer = new ValueComparer<IReadOnlyList<string>>(
        (left, right) => (left ?? Array.Empty<string>()).SequenceEqual(right ?? Array.Empty<string>()),
        value => value == null
            ? 0
            : value.Aggregate(0, (hash, item) =>
                HashCode.Combine(hash, item == null ? 0 : item.GetHashCode())),
        value => (value ?? Array.Empty<string>()).ToArray());

        var trackLevelConverter = new ValueConverter<IReadOnlyList<AcademyTrackLevel>, string>(
            value => JsonSerializer.Serialize(value ?? Array.Empty<AcademyTrackLevel>(), JsonOptions),
            json => JsonSerializer.Deserialize<IReadOnlyList<AcademyTrackLevel>>(json, JsonOptions) ?? Array.Empty<AcademyTrackLevel>());

        var trackLevelComparer = new ValueComparer<IReadOnlyList<AcademyTrackLevel>>(
            (left, right) => (left ?? Array.Empty<AcademyTrackLevel>()).SequenceEqual(right ?? Array.Empty<AcademyTrackLevel>()),
            value => value == null ? 0 : value.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
            value => (value ?? Array.Empty<AcademyTrackLevel>()).ToArray());

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

        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.ToTable("ServiceItems");
            entity.HasKey(service => service.Id);
            entity.Property(service => service.Id).ValueGeneratedNever();
            entity.HasIndex(service => service.Slug).IsUnique();
            entity.Property(service => service.Features)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<ProductItem>(entity =>
        {
            entity.ToTable("ProductItems");
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Id).ValueGeneratedNever();
            entity.HasIndex(product => product.Slug).IsUnique();
            entity.Property(product => product.Features)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<AcademyTrack>(entity =>
        {
            entity.ToTable("AcademyTracks");
            entity.HasKey(track => track.Id);
            entity.Property(track => track.Id).ValueGeneratedNever();
            entity.HasIndex(track => track.Slug).IsUnique();
            entity.Property(track => track.Levels)
                .HasConversion(trackLevelConverter)
                .Metadata.SetValueComparer(trackLevelComparer);
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.ToTable("BlogPosts");
            entity.HasKey(post => post.Id);
            entity.Property(post => post.Id).ValueGeneratedNever();
            entity.HasIndex(post => post.Slug).IsUnique();
            entity.Property(post => post.Tags)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<SiteSettings>(entity =>
        {
            entity.ToTable("SiteSettings");
            entity.HasKey(settings => settings.Id);
            entity.Property(settings => settings.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<Lead>(entity =>
        {
            entity.ToTable("Leads");
            entity.HasKey(lead => lead.Id);
            entity.Property(lead => lead.Id).ValueGeneratedNever();
        });
    }
}
