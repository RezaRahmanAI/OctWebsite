using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CareerPageHero : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CareerPages",
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
                    ResponseTime = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareerPages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CareerPages");
        }
    }
}
