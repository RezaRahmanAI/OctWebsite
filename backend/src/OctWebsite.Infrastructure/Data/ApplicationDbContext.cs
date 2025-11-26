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
    public DbSet<AcademyTrack> AcademyTracks => Set<AcademyTrack>();
    public DbSet<AcademyTrackLevel> AcademyTrackLevels => Set<AcademyTrackLevel>();
    public DbSet<AdmissionStep> AdmissionSteps => Set<AdmissionStep>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value?.GetHashCode() ?? 0)),
                list => list.ToList());

            var statConverter = new ValueConverter<IReadOnlyList<BlogStat>, string>(
                list => JsonSerializer.Serialize(list, JsonSerializerOptions.Default),
                json => (IReadOnlyList<BlogStat>)(JsonSerializer.Deserialize<List<BlogStat>>(json, JsonSerializerOptions.Default) ?? new List<BlogStat>()));
            var statComparer = new ValueComparer<IReadOnlyList<BlogStat>>(
                (left, right) => left.SequenceEqual(right),
                list => list.Aggregate(0, (hash, value) => HashCode.Combine(hash, value?.GetHashCode() ?? 0)),
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
    }
}

