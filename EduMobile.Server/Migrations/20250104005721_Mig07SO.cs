using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduMobile.Server.Migrations
{
    /// <inheritdoc />
    public partial class Mig07SO : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SpecificObjectives",
                table: "Projects",
                newName: "SpecificObjectivesJson");

            migrationBuilder.RenameColumn(
                name: "FunctionalRequirements",
                table: "Projects",
                newName: "FunctionalRequirementsJson");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SpecificObjectivesJson",
                table: "Projects",
                newName: "SpecificObjectives");

            migrationBuilder.RenameColumn(
                name: "FunctionalRequirementsJson",
                table: "Projects",
                newName: "FunctionalRequirements");
        }
    }
}
