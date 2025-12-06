using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OctWebsite.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class job : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobPostings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmploymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    PublishedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobPostings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CareerApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobPostingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CvFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareerApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CareerApplications_JobPostings_JobPostingId",
                        column: x => x.JobPostingId,
                        principalTable: "JobPostings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CareerApplications_JobPostingId",
                table: "CareerApplications",
                column: "JobPostingId");

            var fullStackDescription = @"Full Stack .NET Engineer
We are looking for an experienced and skilled Full Stack .NET Engineer to join our dynamic development team. The ideal candidate should be proficient in Blazor, .NET Core, and have extensive experience in both backend and frontend technologies. This role demands expertise in modern software development practices, including clean architecture, microservices, Agile methodologies, and comprehensive understanding of full-stack development.
Responsibilities and Requirements
 Job Responsibilities:

Develop and Maintain Applications:

• Design, develop, and maintain robust, scalable applications using .NET Core and Blazor frameworks.

• Build responsive and efficient Web APIs to support frontend applications and integrations with third-party systems.

• Employ Entity Framework Core for efficient database operations, including data modeling, querying, and optimization.

• Apply principles of .NET clean architecture for clear separation of concerns, maintainability, and scalability.

• Develop minimal APIs for efficient microservices implementation.

• Design intuitive and responsive UI using Blazor for rich client-side experiences.

Educational Requirements:

• Bachelor’s or Master’s degree in Computer Science, Engineering, or a related field.

 

Experience Requirements:

• 2-7 years of experience in full-stack .NET development with a proven track record of designing, implementing, and deploying complex software solutions.

 

Preferred Technical Skills:

• Strong proficiency in full-stack .NET development, specifically .NET Core.

• Proven experience developing interactive web applications using Blazor.

• Proficient in modern JavaScript frameworks and CSS libraries.

• Solid understanding of MVVM and MVC architecture patterns.

• Hands-on experience with Entity Framework Core and proficient database design skills (SQL Server, PostgreSQL).

• Expertise in microservices architecture and .NET clean architecture.

• Experience building and consuming RESTful Web APIs.

• Familiarity with WPF development for desktop applications (optional but preferred).

• Knowledge of MAUI for cross-platform application development (optional but advantageous).

• Experience with cloud platforms such as AWS or Azure.

• Familiarity with CI/CD pipelines and DevOps tools (Azure DevOps, Jenkins, GitHub Actions).

• Practical experience with containerization technologies (Docker, Kubernetes).

Details: https://forms.gle/x43m62emAj3zhpBo6
Application Form
Name*
Name
Gender*
Gender
Date of Birth*
Date of Birth
Phone*
Phone
Email*
Email
Nationality*
Nationality
Address*
Address
Cover Letter
Cover Letter
Attach CV*
file icon
Uload file less than 3 MB. PDF or DOCX
Cancel
Cancel
Apply";

            migrationBuilder.InsertData(
                table: "JobPostings",
                columns: new[] { "Id", "Active", "Description", "EmploymentType", "Location", "PublishedAt", "Summary", "Title" },
                values: new object[]
                {
                    new Guid("a63c52f0-a0b8-4f1f-9efb-2b9a2b0313c5"),
                    true,
                    fullStackDescription,
                    "Full-time",
                    "Dhaka / Remote",
                    new DateTimeOffset(new DateTime(2025, 6, 15, 0, 0, 0, DateTimeKind.Unspecified), TimeSpan.Zero),
                    "Lead full-stack solutions with Blazor, .NET Core, and modern cloud practices.",
                    "Full Stack .NET Engineer"
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "JobPostings",
                keyColumn: "Id",
                keyValue: new Guid("a63c52f0-a0b8-4f1f-9efb-2b9a2b0313c5"));

            migrationBuilder.DropTable(
                name: "CareerApplications");

            migrationBuilder.DropTable(
                name: "JobPostings");
        }
    }
}
