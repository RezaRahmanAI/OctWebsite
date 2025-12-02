using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnsureServiceExtrasRemoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'AdditionalImageFileNames' AND Object_ID = Object_ID('Services')) " +
                "ALTER TABLE Services DROP COLUMN AdditionalImageFileNames;");

            migrationBuilder.Sql(
                "IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'HeaderVideoFileName' AND Object_ID = Object_ID('Services')) " +
                "ALTER TABLE Services DROP COLUMN HeaderVideoFileName;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalImageFileNames",
                table: "Services",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "HeaderVideoFileName",
                table: "Services",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
