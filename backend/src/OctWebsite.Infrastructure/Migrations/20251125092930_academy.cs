using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class academy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AcademyTracks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AgeRange = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PriceLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Audience = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Format = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroVideoFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroPosterFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Highlights = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LearningOutcomes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CallToActionLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcademyTracks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AcademyTrackLevels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TrackId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tools = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Outcomes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Project = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcademyTrackLevels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AcademyTrackLevels_AcademyTracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "AcademyTracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AdmissionSteps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TrackId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdmissionSteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdmissionSteps_AcademyTracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "AcademyTracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AcademyTrackLevels_TrackId",
                table: "AcademyTrackLevels",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_AcademyTracks_Slug",
                table: "AcademyTracks",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AdmissionSteps_TrackId",
                table: "AdmissionSteps",
                column: "TrackId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AcademyTrackLevels");

            migrationBuilder.DropTable(
                name: "AdmissionSteps");

            migrationBuilder.DropTable(
                name: "AcademyTracks");
        }
    }
}
