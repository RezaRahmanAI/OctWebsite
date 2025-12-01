using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductPages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HeaderEyebrow = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeaderTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeaderSubtitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroVideoFileName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductPages");
        }
    }
}
