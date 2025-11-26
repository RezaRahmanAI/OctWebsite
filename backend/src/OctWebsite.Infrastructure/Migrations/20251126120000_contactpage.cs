using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class contactpage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactPages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HeaderEyebrow = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeaderTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeaderSubtitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroVideoFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroMetaLine = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryCtaLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryCtaLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConsultationOptions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionalSupport = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Emails = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FormOptions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NdaLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResponseTime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OfficesEyebrow = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OfficesTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OfficesDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Offices = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MapEmbedUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MapTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Headquarters = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BusinessHours = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileDownloadLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileDownloadUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactPages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactPages");
        }
    }
}
