using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class pro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProfilePages",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HeaderEyebrow = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeaderTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeaderSubtitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroTagline = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OverviewTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OverviewDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Stats = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pillars = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpotlightTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpotlightDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpotlightBadge = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DownloadLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DownloadFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DownloadUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroImageFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroVideoFileName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfilePages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfilePages",
                schema: "dbo");
        }
    }
}
