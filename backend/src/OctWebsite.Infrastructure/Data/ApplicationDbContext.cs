using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Identity;

namespace OctWebsite.Infrastructure.Data;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<CompanyAbout> CompanyAboutEntries => Set<CompanyAbout>();

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
    }
}
