using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SetDefaultSchemaToDbo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.RenameTable(
                name: "TeamMembers",
                newName: "TeamMembers",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "ServicesPages",
                newName: "ServicesPages",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Services",
                newName: "Services",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "ProductShowcaseItems",
                newName: "ProductShowcaseItems",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "Products",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "ProductPages",
                newName: "ProductPages",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "MethodologyData",
                newName: "MethodologyData",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "JobPostings",
                newName: "JobPostings",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "HomeTrustSections",
                newName: "HomeTrustSections",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "HomeTestimonials",
                newName: "HomeTestimonials",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "HomeHeroSections",
                newName: "HomeHeroSections",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "ContactSubmissions",
                newName: "ContactSubmissions",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "ContactPages",
                newName: "ContactPages",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "CompanyAbout",
                newName: "CompanyAbout",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "CareerPages",
                newName: "CareerPages",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "CareerApplications",
                newName: "CareerApplications",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "BlogPosts",
                newName: "BlogPosts",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AspNetUserTokens",
                newName: "AspNetUserTokens",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AspNetUsers",
                newName: "AspNetUsers",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AspNetUserRoles",
                newName: "AspNetUserRoles",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AspNetUserLogins",
                newName: "AspNetUserLogins",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AspNetUserClaims",
                newName: "AspNetUserClaims",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AspNetRoles",
                newName: "AspNetRoles",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AspNetRoleClaims",
                newName: "AspNetRoleClaims",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AdmissionSteps",
                newName: "AdmissionSteps",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AcademyTracks",
                newName: "AcademyTracks",
                newSchema: "dbo");

            migrationBuilder.RenameTable(
                name: "AcademyTrackLevels",
                newName: "AcademyTrackLevels",
                newSchema: "dbo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "TeamMembers",
                schema: "dbo",
                newName: "TeamMembers");

            migrationBuilder.RenameTable(
                name: "ServicesPages",
                schema: "dbo",
                newName: "ServicesPages");

            migrationBuilder.RenameTable(
                name: "Services",
                schema: "dbo",
                newName: "Services");

            migrationBuilder.RenameTable(
                name: "ProductShowcaseItems",
                schema: "dbo",
                newName: "ProductShowcaseItems");

            migrationBuilder.RenameTable(
                name: "Products",
                schema: "dbo",
                newName: "Products");

            migrationBuilder.RenameTable(
                name: "ProductPages",
                schema: "dbo",
                newName: "ProductPages");

            migrationBuilder.RenameTable(
                name: "MethodologyData",
                schema: "dbo",
                newName: "MethodologyData");

            migrationBuilder.RenameTable(
                name: "JobPostings",
                schema: "dbo",
                newName: "JobPostings");

            migrationBuilder.RenameTable(
                name: "HomeTrustSections",
                schema: "dbo",
                newName: "HomeTrustSections");

            migrationBuilder.RenameTable(
                name: "HomeTestimonials",
                schema: "dbo",
                newName: "HomeTestimonials");

            migrationBuilder.RenameTable(
                name: "HomeHeroSections",
                schema: "dbo",
                newName: "HomeHeroSections");

            migrationBuilder.RenameTable(
                name: "ContactSubmissions",
                schema: "dbo",
                newName: "ContactSubmissions");

            migrationBuilder.RenameTable(
                name: "ContactPages",
                schema: "dbo",
                newName: "ContactPages");

            migrationBuilder.RenameTable(
                name: "CompanyAbout",
                schema: "dbo",
                newName: "CompanyAbout");

            migrationBuilder.RenameTable(
                name: "CareerPages",
                schema: "dbo",
                newName: "CareerPages");

            migrationBuilder.RenameTable(
                name: "CareerApplications",
                schema: "dbo",
                newName: "CareerApplications");

            migrationBuilder.RenameTable(
                name: "BlogPosts",
                schema: "dbo",
                newName: "BlogPosts");

            migrationBuilder.RenameTable(
                name: "AspNetUserTokens",
                schema: "dbo",
                newName: "AspNetUserTokens");

            migrationBuilder.RenameTable(
                name: "AspNetUsers",
                schema: "dbo",
                newName: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "AspNetUserRoles",
                schema: "dbo",
                newName: "AspNetUserRoles");

            migrationBuilder.RenameTable(
                name: "AspNetUserLogins",
                schema: "dbo",
                newName: "AspNetUserLogins");

            migrationBuilder.RenameTable(
                name: "AspNetUserClaims",
                schema: "dbo",
                newName: "AspNetUserClaims");

            migrationBuilder.RenameTable(
                name: "AspNetRoles",
                schema: "dbo",
                newName: "AspNetRoles");

            migrationBuilder.RenameTable(
                name: "AspNetRoleClaims",
                schema: "dbo",
                newName: "AspNetRoleClaims");

            migrationBuilder.RenameTable(
                name: "AdmissionSteps",
                schema: "dbo",
                newName: "AdmissionSteps");

            migrationBuilder.RenameTable(
                name: "AcademyTracks",
                schema: "dbo",
                newName: "AcademyTracks");

            migrationBuilder.RenameTable(
                name: "AcademyTrackLevels",
                schema: "dbo",
                newName: "AcademyTrackLevels");
        }
    }
}
