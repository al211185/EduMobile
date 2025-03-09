using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduMobile.Server.Migrations
{
    /// <inheritdoc />
    public partial class Mig16Bench : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
