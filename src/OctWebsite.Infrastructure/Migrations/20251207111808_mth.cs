using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MethodologyData",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Key = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MethodologyData", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MethodologyData_Key",
                table: "MethodologyData",
                column: "Key",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MethodologyData");
        }
    }
}
