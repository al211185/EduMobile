using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduMobile.Server.Migrations
{
    /// <inheritdoc />
    public partial class Mig17Separacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowedTechnologies",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkConsideredMobileFirst",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkFindings",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkImprovements",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkObjective",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkResponsable",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkSector",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkUsedSmartphoneForComparative",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "BenchmarkUsedSmartphoneForScreens",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ClienteName",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1Difficulties",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1EaseOfUse",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1Name",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1Negatives",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1Positives",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1ScreenshotPath",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1Url",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor1UsefulFeatures",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2Difficulties",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2EaseOfUse",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2Name",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2Negatives",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2Positives",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2ScreenshotPath",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2Url",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Competitor2UsefulFeatures",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CorporateColors",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CorporateFont",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CustomRequirementsJson",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CustomTechnologies",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "FunctionalRequirementsJson",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GeneralObjective",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ReflectiveAnswers",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "SpecificObjectivesJson",
                table: "Projects");

            migrationBuilder.CreateTable(
                name: "PlanningPhases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ClienteName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Responsable = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GeneralObjective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SpecificObjectives = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FunctionalRequirements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomRequirements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorporateColors = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorporateFont = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AllowedTechnologies = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomTechnologies = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReflectionPhase1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BenchmarkObjective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BenchmarkSector = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BenchmarkResponsableF2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor1Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor1ScreenshotPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor1Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor1Positives = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor1Negatives = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor1EaseOfUse = table.Column<int>(type: "int", nullable: false),
                    Competitor1Difficulties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor1UsefulFeatures = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor2Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor2ScreenshotPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor2Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor2Positives = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor2Negatives = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor2EaseOfUse = table.Column<int>(type: "int", nullable: false),
                    Competitor2Difficulties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competitor2UsefulFeatures = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BenchmarkFindings = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BenchmarkImprovements = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BenchmarkUsedSmartphoneForScreens = table.Column<bool>(type: "bit", nullable: false),
                    BenchmarkUsedSmartphoneForComparative = table.Column<bool>(type: "bit", nullable: false),
                    BenchmarkConsideredMobileFirst = table.Column<bool>(type: "bit", nullable: false),
                    ReflectionPhase2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AudienceQuestions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReflectionPhase3 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanningPhases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanningPhases_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlanningPhases_ProjectId",
                table: "PlanningPhases",
                column: "ProjectId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlanningPhases");

            migrationBuilder.AddColumn<string>(
                name: "AllowedTechnologies",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "BenchmarkConsideredMobileFirst",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BenchmarkFindings",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BenchmarkImprovements",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BenchmarkObjective",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BenchmarkResponsable",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BenchmarkSector",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "BenchmarkUsedSmartphoneForComparative",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "BenchmarkUsedSmartphoneForScreens",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ClienteName",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor1Difficulties",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Competitor1EaseOfUse",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Competitor1Name",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor1Negatives",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor1Positives",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor1ScreenshotPath",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor1Url",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor1UsefulFeatures",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor2Difficulties",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Competitor2EaseOfUse",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Competitor2Name",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor2Negatives",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor2Positives",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor2ScreenshotPath",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor2Url",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Competitor2UsefulFeatures",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CorporateColors",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CorporateFont",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomRequirementsJson",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomTechnologies",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FunctionalRequirementsJson",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GeneralObjective",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReflectiveAnswers",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SpecificObjectivesJson",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
