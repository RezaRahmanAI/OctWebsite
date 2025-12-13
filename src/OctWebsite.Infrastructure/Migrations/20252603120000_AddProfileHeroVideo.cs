using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileHeroVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeroVideoFileName",
                schema: "dbo",
                table: "ProfilePages",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroVideoFileName",
                schema: "dbo",
                table: "ProfilePages");
        }
    }
}
